import { CommentLike } from '@src/entities/CommentLike.entity';
import { AppDataSource } from '@src/start/db';

export const CommentLikeRepository = AppDataSource.getRepository(
  CommentLike
).extend({});
