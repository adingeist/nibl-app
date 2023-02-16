import { Plan } from '@src/entities/Subscription/Plan.entity';
import { AppDataSource } from '@src/start/db';

export const PlanRepository = AppDataSource.getRepository(Plan).extend({});
