import { yupObjectId } from '@shared/schemas/util.joi';
import { yupPaginationQuery } from '@shared/schemas/pagination.yup';
import * as Yup from 'yup';

export const followerRouteSchemas = {
  followUser: {
    params: Yup.object().shape({ id: yupObjectId.required() }),
  },

  unfollowUser: {
    params: Yup.object().shape({ id: yupObjectId.required() }),
  },

  getUserFollowers: {
    params: Yup.object().shape({ id: yupObjectId.required() }),
    query: Yup.object().shape(yupPaginationQuery),
  },
};
