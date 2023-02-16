import { CalendarRecipe } from '@src/entities/CalendarRecipe.entity';
import { AppDataSource } from '@src/start/db';

export const CalendarRecipeRepository = AppDataSource.getRepository(
  CalendarRecipe,
).extend({});
