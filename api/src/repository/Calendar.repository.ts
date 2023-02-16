import { Calendar } from '@src/entities/Calendar/Calendar.entity';
import { AppDataSource } from '@src/start/db';

export const CalendarRepository = AppDataSource.getRepository(Calendar).extend(
  {},
);
