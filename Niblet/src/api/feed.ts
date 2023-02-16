import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import {
  IGetFeed,
  IGetFollowingFeed,
} from '@shared/types/routes/feed.controller';

const getFeed: ApiFunction<IGetFeed> = (req, config) =>
  client.getWithAuthToken('/api/v1/feed', {}, config);

const getFollowingFeed: ApiFunction<IGetFollowingFeed> = (req, config) =>
  client.getWithAuthToken(`/api/v1/following-feed`, {}, config);

export const feedApi = {
  getFeed,
  getFollowingFeed,
};
