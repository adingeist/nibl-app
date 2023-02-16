import { Brand } from '@src/entities/Brand.entity';
import { AppDataSource } from '@src/start/db';

export const BrandRepository = AppDataSource.getRepository(Brand).extend({});
