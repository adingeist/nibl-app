import { Notification } from '@src/entities/Notification.entity';
import { AppDataSource } from '@src/start/db';

export const NotificationRepository = AppDataSource.getRepository(
  Notification
).extend({});
