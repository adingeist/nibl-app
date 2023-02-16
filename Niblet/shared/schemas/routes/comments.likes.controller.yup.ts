import { yupObjectId } from '@shared/schemas/util.joi';

export const commentLikesRouteSchema = {
  getACommentsLikes: {
    params: { commentId: yupObjectId.required() },
    query: { likeIdCursor: yupObjectId },
  },

  likeComment: {
    params: { commentId: yupObjectId.required() },
  },

  unlikeComment: {
    params: { commentId: yupObjectId.required() },
  },
};
