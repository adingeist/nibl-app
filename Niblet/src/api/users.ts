import FormData from 'form-data';
import { client } from '@src/api/connection';
import { ApiFunction } from '@src/types/apisauce';
import {
  IPostUser,
  IUpdateUser,
  IGetUser,
  IGetUserProfile,
  IGetUserRecipes,
  IGetUserNibs,
  IGetUserEmail,
  IGetUserPhone,
} from '@shared/types/routes/users.controller';

const getUser: ApiFunction<IGetUser> = (req, config) => {
  return client.get(`/api/v1/users/${req.params.id}`, {}, config);
};

const getUserProfile: ApiFunction<IGetUserProfile> = (req, config) => {
  return client.get(`/api/v1/users/${req.params.username}/profile`, {}, config);
};

const getUserRecipes: ApiFunction<IGetUserRecipes> = (req, config) => {
  return client.get(
    `/api/v1/users/${req.params.username}/recipes`,
    req.query,
    config
  );
};

const getUserEmail: ApiFunction<IGetUserEmail> = (req, config) => {
  return client.getWithAuthToken(`/api/v1/users/self/email`, {}, config);
};

const getUserPhone: ApiFunction<IGetUserPhone> = (req, config) => {
  return client.getWithAuthToken(`/api/v1/users/self/phone`, {}, config);
};

const getUserNibs: ApiFunction<IGetUserNibs> = (req, config) => {
  return client.get(
    `/api/v1/users/${req.params.username}/nibs`,
    req.query,
    config
  );
};

const signUp: ApiFunction<IPostUser> = (req, config) =>
  client.post('/api/v1/users', req.body, config);

const update: ApiFunction<IUpdateUser> = (req, config) => {
  const form = new FormData();

  Object.entries(req.body).forEach(([key, value]) => {
    if (value) form.append(key, value);
  });

  Object.entries(req.attachments).forEach(([key, value]) => {
    if (value) form.append(key, value);
  });

  config = {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return client.putWithAuthToken(
    `/api/v1/users/${req.params.id}`,
    form,
    config
  );
};

export const usersApi = {
  getUser,
  getUserProfile,
  getUserEmail,
  getUserPhone,
  getUserNibs,
  getUserRecipes,
  signUp,
  update,
};
