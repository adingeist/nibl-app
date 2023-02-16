import { Direction } from '@src/entities/Direction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '@src/entities/Post.entity';
import { RecipeIngredient } from '@src/entities/RecipeIngredient.entity';
import { Type } from 'class-transformer';
import { Nib } from '@src/entities/Nib.entity';
import { decimalTransformer } from '@src/utils/ColumnDecimalTransformer';
import { Nutrients } from '@src/entities/Nutrients.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Post, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => Nib, (nib) => nib.recipe, { cascade: true })
  nibs: Nib[];

  @OneToOne(() => Nutrients, { cascade: true, nullable: false })
  @JoinColumn({ name: 'nutrients_id' })
  nutrients: Nutrients;

  @Type(() => RecipeIngredient)
  @OneToMany(() => RecipeIngredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    nullable: false,
  })
  ingredients: RecipeIngredient[];

  @Type(() => Direction)
  @OneToMany(() => Direction, (direction) => direction.recipe, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn({ name: 'direction_id', referencedColumnName: 'id' })
  directions: Direction[];

  @Column({
    name: 'serving_size_quantity',
    type: 'decimal',
    transformer: decimalTransformer,
  })
  servingSizeQuantity: number;

  @Column({ name: 'serving_size_unit' })
  servingSizeUnit: string;

  @Column({
    name: 'servings_per_recipe',
    type: 'decimal',
    transformer: decimalTransformer,
  })
  servingsPerRecipe: number | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ name: 'minute_duration', type: 'int' })
  minuteDuration: number;

  @Column({ name: 'recipe_note', type: 'varchar' })
  recipeNote: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
