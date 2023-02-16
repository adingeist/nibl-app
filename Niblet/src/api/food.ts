import FormData from 'form-data';

import { client } from '@src/api/connection';
import { ApiFunction } from '@src/types/apisauce';
import { FormDataUtil } from '@src/util/FormDataUtil';
import {
  IGetFood,
  IPostFood,
  ISearchFood,
} from '@shared/types/routes/food.controller';

const createFood: ApiFunction<IPostFood> = (req, config) => {
  const form = new FormData();

  FormDataUtil.appendAll(form, req.body);
  FormDataUtil.appendAll(form, req.attachments);

  config = {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return client.postWithAuthToken(`/api/v1/food`, form, config);
};

const searchFoods: ApiFunction<ISearchFood> = (req, config) => {
  return client.get(`/api/v1/food`, req.query, config);
};

const getFood: ApiFunction<IGetFood> = (req, config) => {
  return client.get(`/api/v1/food/${req.params.id}`, config);
};

export const foodApi = {
  createFood,
  searchFoods,
  getFood,
};
