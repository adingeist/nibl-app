import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import {
  ILikeComment,
  ILikePost,
  IUnlikeComment,
  IUnlikePost,
} from '@shared/types/routes/like.controller';

const likePost: ApiFunction<ILikePost> = (req, config) =>
  client.postWithAuthToken(`/api/v1/posts/${req.params.id}/like`, {}, config);

const unlikePost: ApiFunction<IUnlikePost> = (req, config) =>
  client.deleteWithAuthToken(
    `/api/v1/posts/${req.params.id}/unlike`,
    {},
    config,
  );

const likeComment: ApiFunction<ILikeComment> = (req, config) =>
  client.postWithAuthToken(
    `/api/v1/comments/${req.params.id}/like`,
    {},
    config,
  );

const unlikeComment: ApiFunction<IUnlikeComment> = (req, config) =>
  client.deleteWithAuthToken(
    `/api/v1/comments/${req.params.id}/unlike`,
    {},
    config,
  );

export const likeApi = {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
};
