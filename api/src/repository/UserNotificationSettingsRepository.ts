import { UserNotificationSettings } from '@src/entities/UserNotificationSettings.entity';
import { AppDataSource } from '@src/start/db';

export const UserNotificationSettingsRepository = AppDataSource.getRepository(
  UserNotificationSettings
).extend({});
