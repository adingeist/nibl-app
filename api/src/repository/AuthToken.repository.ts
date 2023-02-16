import { AuthToken } from '@src/entities/AuthToken.entity';
import { AppDataSource } from '@src/start/db';

export const AuthTokenRepository = AppDataSource.getRepository(
  AuthToken
).extend({});
