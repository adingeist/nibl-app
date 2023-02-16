import { Direction } from '@src/entities/Direction.entity';
import { AppDataSource } from '@src/start/db';

export const DirectionRepository = AppDataSource.getRepository(
  Direction
).extend({});
