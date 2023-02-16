import { userYupSchema } from '@shared/schemas/user.joi';
import { yupExpoPushToken, yupObjectId } from '@shared/schemas/util.joi';
import * as Yup from 'yup';

export const authRouteSchemas = {
  auth: {
    body: Yup.object().shape({
      username: Yup.string().max(255),
      email: Yup.string().max(255),
      phone: Yup.string().max(255),
      password: Yup.string().max(1024).required(),
    }),
  },

  authOTP: {
    body: Yup.object().shape({
      userId: yupObjectId.required(),
      pin: Yup.string().length(6).required(),
    }),
  },

  authOTPRequest: {
    body: Yup.object().shape({
      email: userYupSchema.email,
      phone: userYupSchema.phone,
    }),
  },

  logout: {
    body: Yup.object().shape({
      pushToken: yupExpoPushToken.required('An Expo push token must be sent'),
    }),
  },
};
