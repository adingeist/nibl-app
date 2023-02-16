import { RecipeIngredient } from '@src/entities/RecipeIngredient.entity';
import { AppDataSource } from '@src/start/db';

export const RecipeIngredientRepository = AppDataSource.getRepository(
  RecipeIngredient
).extend({});
