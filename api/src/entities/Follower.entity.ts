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
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { cascade: true, nullable: false })
  @JoinColumn({ name: 'follower_id' })
  followerUser: User;

  @ManyToOne(() => User, { cascade: true, nullable: false })
  @JoinColumn({ name: 'following_id' })
  followingUser: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
