import { yupObjectId } from '@shared/schemas/util.joi';
import * as Yup from 'yup';

export const commentsRepliesRouteSchemas = {
  getACommentsReplies: {
    params: { commentId: yupObjectId.required() },
    query: { createdAtCursor: Yup.date() },
  },
};
