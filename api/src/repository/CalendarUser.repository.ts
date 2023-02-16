import { CalendarUser } from '@src/entities/Calendar/CalendarUser.entity';
import { AppDataSource } from '@src/start/db';

export const CalendarUserRepository = AppDataSource.getRepository(
  CalendarUser,
).extend({});
