import { CalendarFood } from '@src/entities/CalendarFood.entity';
import { AppDataSource } from '@src/start/db';

export const CalendarFoodRepository = AppDataSource.getRepository(
  CalendarFood,
).extend({});
