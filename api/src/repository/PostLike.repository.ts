import { PostLike } from '@src/entities/PostLike.entity';
import { AppDataSource } from '@src/start/db';

export const PostLikeRepository = AppDataSource.getRepository(PostLike).extend({
  countByLikedPostId(id: string) {
    return this.countBy({ postLiked: { id } });
  },

  async isPostIdLikedByUserId(postId: string, userId: string) {
    const isLiked = (await this.findOneBy({
      postLiked: { id: postId },
      likedBy: { id: userId },
    }))
      ? true
      : false;
    return isLiked;
  },
});
