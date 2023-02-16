import { tokenYupSchema } from '@shared/schemas/token.joi';
import { userYupSchema } from '@shared/schemas/user.joi';
import { UserValidation } from '@shared/validation/user.validation';
import * as Yup from 'yup';

export type IGetAuthToken = {
  body: Record<string, never>;
  query: { credential: string };
  params: Record<string, never>;
};

export type IPostPasswordReset = {
  body: { credential: string; pin: string; password: string };
  query: Record<string, never>;
  params: Record<string, never>;
};

export const userPwdForgotRouteSchemas = {
  getAuthToken: {
    query: {
      credential: Yup.string()
        .min(3, 'Credential must be at least ${min} characters')
        .max(
          UserValidation.MAX_EMAIL_LENGTH,
          'Credential must be ${max} characters or less'
        ),
    },
  },

  postPasswordReset: {
    body: {
      credential: Yup.string()
        .min(3, 'Credential must be at least ${min} characters')
        .max(
          UserValidation.MAX_EMAIL_LENGTH,
          'Credential must be ${max} characters or less'
        )
        .required('Credential is required'),
      password: userYupSchema.password.required('Password is required'),
      pin: tokenYupSchema.pin.required('A token is required'),
    },
  },
};
