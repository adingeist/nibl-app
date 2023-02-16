import { userYupSchema } from '@shared/schemas/user.joi';

export type IGetIsUserValid = {
  body: Record<string, never>;
  query: { username?: string; email?: string; phone?: string };
  params: Record<string, never>;
};

export const userValidateRouteSchemas = {
  getIsUserValid: {
    query: {
      username: userYupSchema.username,
      email: userYupSchema.email,
      phone: userYupSchema.phone,
    },
  },
};
