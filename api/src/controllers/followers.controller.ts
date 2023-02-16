import { auth } from '@src/middleware/auth';
import { validate } from '@src/middleware/validate';
import { FollowerRepository } from '@src/repository/Follower.repository';
import { UserRepository } from '@src/repository/User.repository';
import { RouteSchemas } from '@shared/schemas/routes';
import { FollowerDto } from '@shared/types/dto/Follower.entity';
import {
  IFollowUser,
  IGetFollowers,
  IGetFollowing,
  IUnfollowUser,
} from '@shared/types/routes/followers.controller';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { ApiError } from '@src/utils/ApiError';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';
import { instanceToPlain } from 'class-transformer';
import express from 'express';
import { NotificationsService } from '@src/services/Notifications.service';

const router = express.Router();

// POST /users/:id/follow
router.post<
  IFollowUser['params'],
  IFollowUser['res'],
  IFollowUser['body'],
  IFollowUser['query']
>(
  `/users/:id/follow`,
  auth('user'),
  validate(RouteSchemas.followUser),
  async (req, res) => {
    const targetUserId = req.params.id;

    const user = await UserRepository.findUserRequestingOrThrow404(req);

    if (user.id === targetUserId) {
      throw new ApiError(400, `You can't follow yourself`);
    }

    const targetUser = await UserRepository.findOneBy({ id: targetUserId });

    if (!targetUser) {
      throw new ApiError(404, 'User to follow not found');
    }

    let follower = FollowerRepository.create({
      followerUser: user,
      followingUser: targetUser,
    });

    follower = await FollowerRepository.save(follower);

    const followerDto = instanceToPlain(follower) as FollowerDto;

    NotificationsService.sendNewFollowerNotification(targetUser.id, user);

    res.send({
      id: followerDto.id,
      followerUser: {
        id: user.id,
        profileImage: user.profileImage,
        username: user.username,
        requesterIsFollowing: false,
      },
      followingUser: {
        id: targetUser.id,
        profileImage: targetUser.profileImage,
        username: targetUser.username,
        requesterIsFollowing: true,
      },
      createdAt: followerDto.createdAt,
      updatedAt: followerDto.updatedAt,
    });
  },
);

// DELETE /users/:id/unfollow
router.delete<
  IUnfollowUser['params'],
  IUnfollowUser['res'],
  IUnfollowUser['body'],
  IUnfollowUser['query']
>(
  `/users/:id/unfollow`,
  auth('user'),
  validate(RouteSchemas.unfollowUser),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    const { affected } = await FollowerRepository.delete({
      followerUser: { id: userRequesting.id },
      followingUser: { id: req.params.id },
    });

    if (!affected) {
      throw new ApiError(404, 'Follower relation to delete not found');
    }

    res.status(204).send();
  },
);

// GET /users/:id/followers
router.get<
  IGetFollowers['params'],
  IGetFollowers['res'],
  IGetFollowers['body'],
  IGetFollowers['query']
>(
  `/users/:id/followers`,
  auth('user'),
  validate(RouteSchemas.getUserFollowers),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;
    const page = req.query.page ? Number.parseInt(req.query.page) : 0;
    const take = req.query.perPage ? Number.parseInt(req.query.perPage) : 10;
    const skip = page * take;
    const id = req.params.id;

    const [followers, totalCount] = await UserRepository.findFollowerDtosOfId(
      id,
      skip,
      take,
      userRequesting.id,
    );

    res.send({
      followers,
      ...getPaginationMetaData(page, take, totalCount),
    });
  },
);

// GET /users/:id/following
router.get<
  IGetFollowing['params'],
  IGetFollowing['res'],
  IGetFollowing['body'],
  IGetFollowing['query']
>(
  `/users/:id/following`,
  auth('user'),
  validate(RouteSchemas.getUserFollowers),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;
    const page = req.query.page ? Number.parseInt(req.query.page) : 0;
    const take = req.query.perPage ? Number.parseInt(req.query.perPage) : 10;
    const skip = page * take;
    const id = req.params.id;

    const [following, totalCount] = await UserRepository.findFollowingDtosOfId(
      id,
      skip,
      take,
      userRequesting.id,
    );

    res.send({
      following,
      ...getPaginationMetaData(page, take, totalCount),
    });
  },
);

export default router;
