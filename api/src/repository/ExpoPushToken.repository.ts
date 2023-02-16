import { ExpoPushToken } from '@src/entities/ExpoPushToken.entity';
import { AppDataSource } from '@src/start/db';

export const ExpoPushTokenRepository = AppDataSource.getRepository(
  ExpoPushToken
).extend({
  findByUserId(userId: string) {
    return this.findBy({ user: { id: userId } });
  },

  deleteByToken(token: string) {
    return this.delete({ token });
  },
});
