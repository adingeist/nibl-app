import { Subscription } from '@src/entities/Subscription/Subscription.entity';
import { AppDataSource } from '@src/start/db';

export const SubscriptionRepository = AppDataSource.getRepository(
  Subscription,
).extend({});
