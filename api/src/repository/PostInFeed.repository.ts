import { PostInFeed } from '@src/entities/PostInFeed.entity';
import { AppDataSource } from '@src/start/db';

export const PostInFeedRepository = AppDataSource.getRepository(
  PostInFeed
).extend({});
