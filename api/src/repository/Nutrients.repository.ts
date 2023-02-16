import { Nutrients } from '@src/entities/Nutrients.entity';
import { AppDataSource } from '@src/start/db';

export const NutrientsRepository = AppDataSource.getRepository(
  Nutrients
).extend({});
