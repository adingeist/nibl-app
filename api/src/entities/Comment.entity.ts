import { CommentLike } from '@src/entities/CommentLike.entity';
import { Post } from '@src/entities/Post.entity';
import { User } from '@src/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  body: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'on_post_id' })
  onPost: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'posted_by_id' })
  postedBy: User;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'root_parent_id' })
  rootParent: Comment | null;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'first_parent_id' })
  firstParent: Comment | null;

  @OneToMany(() => Comment, (reply) => reply.rootParent)
  children: Comment | null;

  @OneToMany(() => CommentLike, (like) => like.commentLiked, { cascade: true })
  likes: CommentLike[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
