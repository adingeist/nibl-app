import { User } from '@src/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Type } from 'class-transformer';

@Entity({ name: 'auth_token' })
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => User)
  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  sentToEmail: boolean;

  @Column({ default: false })
  sentToPhone: boolean;

  @Column()
  pin: string;

  @Column({ default: 0 })
  attempts: number;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  comparePin(pin: string) {
    return bcrypt.compare(pin, this.pin);
  }
}
