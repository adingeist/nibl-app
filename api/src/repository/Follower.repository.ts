import { Follower } from '@src/entities/Follower.entity';
import { FollowerDto } from '@shared/types/dto/Follower.entity';
import { AppDataSource } from '@src/start/db';

export const FollowerRepository = AppDataSource.getRepository(Follower).extend({
  async isUserIdFollowingUserId(followerId: string, followingId: string) {
    const followerRelationship = await this.findOneBy({
      followerUser: { id: followerId },
      followingUser: { id: followingId },
    });

    return followerRelationship ? true : false;
  },

  async findFollowersOfId(
    id: string,
    skip: number,
    take: number,
    requesterId?: string,
  ): Promise<[FollowerDto, number]> {
    const [followers, totalCount] = await this.createQueryBuilder('f')
      .where('f.following_id = :id', { id })
      .leftJoinAndMapOne('f.followerUser', 'f.followerUser', 'followerUser')
      .leftJoinAndMapOne('f.followingUser', 'f.followingUser', 'followingUser')
      .loadRelationCountAndMap(
        'followerUser.requesterFollowing',
        'f.followingUser',
        'follow',
        (query) =>
          query.where('follow.followerUser = :requesterId', { requesterId }),
      )
      .loadRelationCountAndMap(
        'followerUser.requesterFollowing',
        'f.followerUser',
        'follow',
        (query) =>
          query.where('follow.followerUser = :requesterId', { requesterId }),
      )
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const boolFollowers = followers.map((follower) => ({
      ...follower,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - The property exists from the SQL query
      requesterFollowing: follower.requesterFollowing ? true : false,
    })) as unknown as FollowerDto;

    return [boolFollowers, totalCount];
  },

  async findFollowingOfId(
    id: string,
    skip: number,
    take: number,
    requesterId?: string,
  ): Promise<[FollowerDto, number]> {
    const [followings, totalCount] = await this.createQueryBuilder('f')
      .where('f.follower_id = :id', { id })
      .leftJoinAndMapOne('f.followerUser', 'f.followerUser', 'followerUser')
      .leftJoinAndMapOne('f.followingUser', 'f.followingUser', 'followingUser')
      .loadRelationCountAndMap(
        'followerUser.requesterFollowing',
        'f.followingUser',
        'follow',
        (query) =>
          query.where('follow.followerUser = :requesterId', { requesterId }),
      )
      .loadRelationCountAndMap(
        'followerUser.requesterFollowing',
        'f.followerUser',
        'follow',
        (query) =>
          query.where('follow.followerUser = :requesterId', { requesterId }),
      )
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const boolFollowings = followings.map((following) => ({
      ...following,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - The property exists from the SQL query
      requesterFollowing: following.requesterFollowing ? true : false,
    })) as unknown as FollowerDto;

    return [boolFollowings, totalCount];
  },
});
