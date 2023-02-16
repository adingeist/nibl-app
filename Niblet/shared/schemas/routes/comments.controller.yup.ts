import { CommentValidation } from '@shared/validation/comment.validation';
import { yupObjectId } from '@shared/schemas/util.joi';
import * as Yup from 'yup';
import { yupPaginationQuery } from '@shared/schemas/pagination.yup';

export const CommentJoiSchema = {
  body: Yup.string().max(CommentValidation.MAX_MESSAGE_LENGTH),
};

export const commentRouteSchemas = {
  postComment: {
    params: Yup.object().shape({
      postId: yupObjectId.required(),
    }),

    body: Yup.object().shape(
      {
        body: CommentJoiSchema.body.required(),
        rootParentId: yupObjectId.when('firstParentId', {
          is: (firstParentId?: string) =>
            firstParentId && firstParentId.length > 0,
          then: Yup.string().required(),
        }),
        firstParentId: yupObjectId.when('rootParentId', {
          is: (rootParentId?: string) =>
            rootParentId && rootParentId.length > 0,
          then: Yup.string().required(),
        }),
      },
      [['rootParentId', 'firstParentId']],
    ),
  },

  getComments: {
    params: Yup.object().shape({
      postId: yupObjectId.required(),
    }),

    query: Yup.object().shape(yupPaginationQuery),
  },

  getCommentReplies: {
    params: Yup.object().shape({
      postId: yupObjectId.required(),
      commentId: yupObjectId.required(),
    }),

    query: Yup.object().shape(yupPaginationQuery),
  },

  deleteComment: {
    params: Yup.object().shape({
      commentId: yupObjectId.required(),
    }),
  },
};
