import { yupObjectId } from '@shared/schemas/util.joi';

export const usersFollowersRouteSchemas = {
  getFollowers: {
    params: { userId: yupObjectId.required() },
    query: { userIdCursor: yupObjectId },
  },

  getFollowings: {
    params: { userId: yupObjectId.required() },
    query: { userIdCursor: yupObjectId },
  },

  follow: {
    params: { userId: yupObjectId.required() },
  },

  unfollow: {
    params: { userId: yupObjectId.required() },
  },
};
