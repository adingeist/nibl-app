import { appConfig } from '@src/utils/config';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiError } from '@src/utils/ApiError';
import { AuthToken } from '@src/entities/AuthToken.entity';
import { emailService } from '@src/services/Email.service';
import { hash } from '@src/utils/bcrypt';
import { Options } from 'nodemailer/lib/mailer';
import { smsService } from '@src/services/Sms.service';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import rootDir from 'app-root-path';
import secureRandom from 'random-number-csprng';
import { UserRoles } from '@src/entities/enums/UserRoles.enum';
import { Exclude, Expose } from 'class-transformer';
import { storageService } from '@src/services/Storage.service';
import { ExpoPushToken } from '@src/entities/ExpoPushToken.entity';
import { Follower } from '@src/entities/Follower.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date | null;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  link: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @Exclude({ toPlainOnly: true })
  @Column({ name: 'profile_image_key', type: 'varchar', nullable: true })
  profileImageKey: string | null;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_email_verified', default: false })
  emailIsVerified: boolean;

  @Column({ name: 'is_phone_verified', default: false })
  phoneIsVerified: boolean;

  @OneToMany(() => ExpoPushToken, (push) => push.user)
  expoPushTokens: ExpoPushToken[];

  @OneToMany(() => Follower, (follower) => follower.followerUser)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.followingUser)
  followings: Follower[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Expose()
  public get profileImage() {
    if (!this.profileImageKey) return;
    return storageService.keyToUri(this.profileImageKey);
  }

  getJWT() {
    const payload = {
      id: this.id,
      username: this.username,
      profileImage: this.profileImage,
      role: this.role,
      isVerified: this.isVerified,
    };
    return jwt.sign(payload, appConfig.get('jwtPrivateKey'));
  }

  async emailAuthToken() {
    const { token, pin } = await this.createAuthToken();

    const emailFile = await fs.readFile(
      `${rootDir}/src/emails/verify-email.html`,
      { encoding: 'utf-8' },
    );
    const template = handlebars.compile<{ pin: string }>(emailFile);
    const html = template({ pin });

    await this.sendEmail(html, {
      subject: `Your code is ${pin}`,
      attachments: [
        {
          filename: 'email-title.png',
          path: `${rootDir}/src/assets/email-title.png`,
          cid: 'title-img',
        },
        {
          filename: 'email-logo.png',
          path: `${rootDir}/src/assets/email-logo.png`,
          cid: 'logo-img',
        },
      ],
    });
    token.sentToEmail = true;
    return token;
  }

  async smsAuthToken() {
    const { token, pin } = await this.createAuthToken();
    await this.sendSms(`Your Nibl verification code is ${pin}`);
    token.sentToPhone = true;
    return token;
  }

  comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  private async createAuthToken() {
    const token = new AuthToken();

    // Generates pin 000000 - 999999
    const randomNum = await secureRandom(0, 999999);
    const pin = randomNum.toString().padStart(6, '0');
    token.pin = await hash(pin);
    token.expiresAt = moment().add(15, 'minutes').toDate();
    token.user = this;

    return { token, pin };
  }

  private async sendEmail(html: string, options: Options) {
    if (!this.email) throw new ApiError(400, `User doesn't have an email`);
    return await emailService.sendEmail(this.email, html, options);
  }

  private async sendSms(message: string) {
    if (!this.phone)
      throw new ApiError(400, `User doesn't have a phone number`);
    return smsService.sendMessage(this.phone, message);
  }
}
