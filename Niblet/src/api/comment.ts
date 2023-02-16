import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import {
  IDeleteComment,
  IGetCommentReplies,
  IGetComments,
  IPostComment,
} from '@shared/types/routes/comment.controller';

const postComment: ApiFunction<IPostComment> = (req, config) => {
  return client.postWithAuthToken(
    `/api/v1/posts/${req.params.postId}/comments`,
    req.body,
    config,
  );
};

const getComments: ApiFunction<IGetComments> = (req, config) => {
  return client.getWithAuthToken(
    `/api/v1/posts/${req.params.postId}/comments`,
    req.query,
    config,
  );
};

const getCommentReplies: ApiFunction<IGetCommentReplies> = (req, config) => {
  return client.getWithAuthToken(
    `/api/v1/posts/${req.params.postId}/comments/${req.params.commentId}/replies`,
    req.query,
    config,
  );
};

const deleteComment: ApiFunction<IDeleteComment> = (req, config) => {
  return client.deleteWithAuthToken(
    `/api/v1/comments/${req.params.commentId}`,
    {},
    config,
  );
};

export const commentApi = {
  getComments,
  getCommentReplies,
  postComment,
  deleteComment,
};
