import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@src/entities/User.entity';
import { Hashtag } from '@src/entities/Hashtag.entity';
import { PostInFeed } from '@src/entities/PostInFeed.entity';
import { storageService } from '@src/services/Storage.service';
import { Expose, Exclude } from 'class-transformer';
import { PostLike } from '@src/entities/PostLike.entity';
import { Comment } from '@src/entities/Comment.entity';
import { Type } from 'class-transformer';
import { Recipe } from '@src/entities/Recipe.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => User)
  @ManyToOne(() => User, { cascade: true, nullable: false })
  @JoinColumn({ name: 'posted_by_id' })
  postedBy: User;

  @Type(() => PostLike)
  @OneToMany(() => PostLike, (like) => like.postLiked, { cascade: true })
  likes: PostLike[];

  @Type(() => Comment)
  @OneToMany(() => Comment, (comment) => comment.onPost, { cascade: true })
  comments: Comment[];

  @Type(() => Hashtag)
  @ManyToMany(() => Hashtag, { cascade: true, nullable: true })
  @JoinTable()
  hashtags: Hashtag[] | null;

  @Type(() => PostInFeed)
  @OneToMany(() => PostInFeed, (postInFeed) => postInFeed.post, {
    cascade: true,
  })
  inUsersFeeds: PostInFeed[];

  @Column({ type: 'varchar', nullable: true })
  caption: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  videoKey: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  bannerKey: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  thumbnailKey: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => Recipe, (recipe) => recipe.post, { onDelete: 'CASCADE' })
  recipe: Recipe | null;

  @Expose()
  public get video() {
    return storageService.keyToUri(this.videoKey);
  }

  @Expose()
  public get banner() {
    return storageService.keyToUri(this.bannerKey);
  }

  @Expose()
  public get thumbnail() {
    return storageService.keyToUri(this.thumbnailKey);
  }
}
