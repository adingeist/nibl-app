import { Post } from '@src/entities/Post.entity';
import { User } from '@src/entities/User.entity';
import { PostDtoType } from '@src/shared/types/dto/Post.entity';
import { AppDataSource } from '@src/start/db';

export const PostRepository = AppDataSource.getRepository(Post).extend({
  async getFollowingFeedPosts(
    userId: string,
    take: number,
    skip: number,
  ): Promise<[PostDtoType[], number]> {
    const [posts, totalCount] = (await this.createQueryBuilder('p')
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .loadRelationCountAndMap('p.requesterLiked', 'p.likes', 'pl', (q) =>
        q.where('pl.likedBy = :userId', { userId }),
      )
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'posted_by',
        'p.posted_by_id = posted_by.id',
      )
      .loadRelationCountAndMap(
        'posted_by.requesterIsFollowing',
        'posted_by.followers',
        'follower',
        (q) => q.where('follower.following_id = :userId', { userId }),
      )
      .leftJoinAndSelect('posted_by.followers', 'followers')
      .where('followers.following_id = :userId', { userId })
      .orWhere('posted_by.id = :userId', { userId })
      .skip(skip)
      .take(take)
      .getManyAndCount()) as [
      (Post & {
        requesterLiked: boolean | number;
        postedBy: { requesterIsFollowing: boolean | number };
      })[],
      number,
    ];

    const postsDto = posts.map((p) => {
      p.requesterLiked = p.requesterLiked !== 0;
      p.postedBy.requesterIsFollowing = p.postedBy.requesterIsFollowing !== 0;
      return p;
    }) as unknown as PostDtoType[];

    return [postsDto, totalCount];
  },
});
