import { User } from '@src/entities/User.entity';
import { FollowerDto } from '@shared/types/dto/Follower.entity';
import { PostedByDtoType } from '@shared/types/dto/PostedByDto';
import { AppDataSource } from '@src/start/db';
import { ApiError } from '@src/utils/ApiError';
import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findByUsername(username: string | null) {
    return username ? this.findOneBy({ username }) : null;
  },

  findByEmail(email: string | null) {
    return email ? this.findOneBy({ email }) : null;
  },

  findByPhone(phone: string | null) {
    return phone ? this.findOneBy({ phone }) : null;
  },

  async findUserRequestingOrThrow404(req: Request) {
    const notFoundError = new ApiError(404, 'User requesting not found');

    if (!req.user) {
      throw notFoundError;
    }

    const user = await this.findOneBy({ id: req.user.id });

    if (!user) {
      throw notFoundError;
    }

    return user;
  },

  async findFollowerDtosOfId(
    id: string,
    skip: number,
    take: number,
    userRequestingId: string,
  ): Promise<[PostedByDtoType[], number]> {
    const [followers, totalCount] = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'follower')
      .where('follower.following_id = :id', { id })
      .loadRelationCountAndMap(
        'requesterIsFollowing',
        'user.followers',
        'follower',
        (query) =>
          query.where('follower.following_id = :userRequestingId', {
            userRequestingId,
          }),
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

    const followersDto = instanceToPlain(boolFollowers) as PostedByDtoType[];

    return [followersDto, totalCount];
  },

  async findFollowingDtosOfId(
    id: string,
    skip: number,
    take: number,
    userRequestingId: string,
  ): Promise<[PostedByDtoType[], number]> {
    const [followings, totalCount] = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.followings', 'following')
      .where('following.follower_id = :id', { id })
      .loadRelationCountAndMap(
        'requesterIsFollowing',
        'user.followings',
        'following',
        (query) =>
          query.where('following.follower_id = :userRequestingId', {
            userRequestingId,
          }),
      )
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const boolFollowers = followings.map((following) => ({
      ...following,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - The property exists from the SQL query
      requesterFollowing: following.requesterFollowing ? true : false,
    })) as unknown as FollowerDto;

    const followingsDto = instanceToPlain(boolFollowers) as PostedByDtoType[];

    return [followingsDto, totalCount];
  },
});
