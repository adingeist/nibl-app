import { User } from '@src/entities/User.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserNotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @OneToOne(() => User)
  user: User;

  @Column({ name: 'notify_post_likes', default: true })
  notifyPostLikes: boolean;

  @Column({ name: 'notify_comment_on_post', default: true })
  notifyCommentOnPost: boolean;

  @Column({ name: 'notify_recipe_gets_nib', default: true })
  notifyRecipeGetsNib: boolean;

  @Column({ name: 'notify_comment_reply', default: true })
  notifyCommentReply: boolean;
}
