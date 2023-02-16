import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import {
  IFollowUser,
  IGetFollowers,
  IGetFollowing,
} from '@shared/types/routes/followers.controller';

const followUser: ApiFunction<IFollowUser> = (req, config) =>
  client.postWithAuthToken(`/api/v1/users/${req.params.id}/follow`, {}, config);

const unfollowUser: ApiFunction<IFollowUser> = (req, config) =>
  client.deleteWithAuthToken(
    `/api/v1/users/${req.params.id}/unfollow`,
    {},
    config,
  );

const getFollowers: ApiFunction<IGetFollowers> = (req, config) =>
  client.getWithAuthToken(
    `/api/v1/users/${req.params.id}/followers`,
    req.query,
    config,
  );

const getFollowing: ApiFunction<IGetFollowing> = (req, config) =>
  client.getWithAuthToken(
    `/api/v1/users/${req.params.id}/following`,
    req.query,
    config,
  );

export const followersApi = {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
};
