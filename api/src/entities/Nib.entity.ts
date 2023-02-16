import { Post } from '@src/entities/Post.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Nib {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Post, { cascade: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Recipe)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
