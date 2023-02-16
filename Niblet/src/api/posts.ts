import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import { IDeletePost } from '@shared/types/routes/posts.controller';

const deletePost: ApiFunction<IDeletePost> = (req, config) =>
  client.deleteWithAuthToken(`/api/v1/posts/${req.params.id}`, {}, config);

export const postsApi = {
  deletePost,
};
