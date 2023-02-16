import { UserNotificationSettings } from '@src/entities/UserNotificationSettings.entity';
import { AppDataSource } from '@src/start/db';

export const NotificationSettingsRepository = AppDataSource.getRepository(
  UserNotificationSettings,
).extend({});
