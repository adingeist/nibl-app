import { NotificationEnum } from '@src/entities/enums/Notification.enum';
import { Nib } from '@src/entities/Nib.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import { User } from '@src/entities/User.entity';
import { Comment } from '@src/entities/Comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => User)
  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_notified_id' })
  userNotified: User;

  @Column({
    type: 'enum',
    enum: NotificationEnum,
  })
  type: NotificationEnum;

  @ManyToOne(() => User, { cascade: true, nullable: true })
  @JoinColumn({ name: 'triggered_by_user_id' })
  triggeredByUser: User | null;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe | null;

  @ManyToOne(() => Nib, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'nib_id' })
  nib: Nib | null;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
