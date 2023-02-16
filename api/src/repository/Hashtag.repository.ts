import { Hashtag } from '@src/entities/Hashtag.entity';
import { AppDataSource } from '@src/start/db';

export const HashtagRepository = AppDataSource.getRepository(Hashtag).extend(
  {}
);
