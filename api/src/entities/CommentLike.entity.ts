import { Comment } from '@src/entities/Comment.entity';
import { User } from '@src/entities/User.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Comment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_liked_id' })
  commentLiked: Comment;

  @ManyToOne(() => User, { cascade: true, nullable: false })
  @JoinColumn({ name: 'liked_by_id' })
  likedBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
