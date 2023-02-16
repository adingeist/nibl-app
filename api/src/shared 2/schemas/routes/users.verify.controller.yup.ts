import { tokenYupSchema } from '@shared/schemas/token.joi';
import { yupObjectId } from '@shared/schemas/util.joi';

export const userVerifyRouteSchemas = {
  getAuthEmail: { params: { id: yupObjectId.required() } },

  postAuthFromEmail: {
    params: {
      id: yupObjectId.required(),
      pin: tokenYupSchema.pin.required('A token is required'),
    },
  },

  getAuthPhone: {
    params: {
      id: yupObjectId.required(),
    },
  },

  postAuthFromPhone: {
    params: {
      id: yupObjectId.required(),
      pin: tokenYupSchema.pin.required('A token is required'),
    },
  },
};
