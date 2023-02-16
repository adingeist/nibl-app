import { CustomUnit } from '@src/entities/CustomUnit.entity';
import { AppDataSource } from '@src/start/db';

export const CustomUnitRepository = AppDataSource.getRepository(
  CustomUnit
).extend({});
