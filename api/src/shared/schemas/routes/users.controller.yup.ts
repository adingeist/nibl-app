import { yupObjectId } from '@shared/schemas/util.joi';
import { userYupSchema } from '@shared/schemas/user.joi';
import * as Yup from 'yup';

export const userRouteSchemas = {
  getUser: { params: Yup.object().shape({ id: yupObjectId }) },

  getUserProfile: {
    params: Yup.object().shape({
      username: userYupSchema.username.required('Username is required'),
    }),
  },

  getUserNibs: {
    params: Yup.object().shape({
      username: userYupSchema.username.required('Username is required'),
    }),
    query: Yup.object().shape({
      take: Yup.number().positive().max(100),
      skip: Yup.number().positive(),
    }),
  },

  getUserRecipes: {
    params: Yup.object().shape({
      username: userYupSchema.username.required('Username is required'),
    }),
    query: Yup.object().shape({
      take: Yup.number().positive().max(100),
      skip: Yup.number().positive(),
    }),
  },

  postUser: {
    body: Yup.object().shape({
      email: userYupSchema.email,
      phone: userYupSchema.phone,
      username: userYupSchema.username.required('Username is required'),
      password: userYupSchema.password.required('Password is required'),
    }),
  },

  updateUser: {
    params: Yup.object().shape({ id: yupObjectId }),
    body: Yup.object().shape({
      email: userYupSchema.email,
      phone: userYupSchema.phone,
      link: userYupSchema.link,
      bio: userYupSchema.bio,
      birthday: userYupSchema.birthday,
      username: userYupSchema.username,
      password: userYupSchema.password,
    }),
  },

  deleteUser: { params: Yup.object().shape({ id: yupObjectId }) },
};
