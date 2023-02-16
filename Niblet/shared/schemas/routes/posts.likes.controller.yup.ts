import { yupObjectId } from '@shared/schemas/util.joi';
import { yupPaginationQuery } from '@shared/schemas/pagination.yup';
import * as Yup from 'yup';

export const postRouteSchemas = {
  likePost: { params: Yup.object().shape({ id: yupObjectId.required() }) },

  unlikePost: {
    params: Yup.object().shape({ id: yupObjectId.required() }),
  },

  getFollowingFeed: { query: Yup.object(yupPaginationQuery) },
};
