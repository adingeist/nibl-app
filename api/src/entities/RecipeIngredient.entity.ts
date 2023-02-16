import { Food } from '@src/entities/Food.entity';
import { Recipe } from '@src/entities/Recipe.entity';
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
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Type(() => Recipe)
  @ManyToOne(() => Recipe, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Type(() => Food)
  @ManyToOne(() => Food, { cascade: true, nullable: false })
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  unit: string;

  @Column({ name: 'ingredient_note' })
  ingredientNote: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
