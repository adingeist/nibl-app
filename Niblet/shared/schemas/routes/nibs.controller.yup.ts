import { yupObjectId } from '@shared/schemas/util.joi';
import { postYupSchema } from '@shared/schemas/post.joi';
import * as Yup from 'yup';

export const nibsRouteSchemas = {
  postNib: {
    body: Yup.object().shape({
      recipeId: yupObjectId.required(),
      caption: postYupSchema.caption,
    }),
  },
};
