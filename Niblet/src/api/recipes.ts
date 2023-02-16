import FormData from 'form-data';

import { client } from '@src/api/connection';
import { ApiFunction } from '@src/types/apisauce';
import {
  IGetRecipe,
  IGetRecipeNibs,
  IPostRecipe,
} from '@shared/types/routes/recipe.controller';
import { FormDataUtil } from '@src/util/FormDataUtil';

const getRecipe: ApiFunction<IGetRecipe> = (req, config) => {
  return client.getWithAuthToken(
    `/api/v1/recipes/${req.params.id}`,
    {},
    config,
  );
};

const getNibs: ApiFunction<IGetRecipeNibs> = (req, config) => {
  return client.getWithAuthToken(
    `/api/v1/recipes/${req.params.id}/nibs`,
    {},
    config,
  );
};

const postRecipe: ApiFunction<IPostRecipe> = (req, config) => {
  const form = new FormData();

  form.append('caption', req.body.caption);
  form.append('directions', JSON.stringify(req.body.directions));
  form.append('ingredients', JSON.stringify(req.body.ingredients));
  form.append('minuteDuration', req.body.minuteDuration);
  form.append('recipeNote', req.body.recipeNote);
  form.append('title', req.body.title);
  form.append('warnings', JSON.stringify(req.body.warnings));
  form.append('hashtags', JSON.stringify(req.body.hashtags));
  form.append('servingsPerRecipe', JSON.stringify(req.body.servingsPerRecipe));
  form.append(
    'servingSizeQuantity',
    JSON.stringify(req.body.servingSizeQuantity),
  );
  form.append('servingSizeUnit', JSON.stringify(req.body.servingSizeUnit));
  form.append('nutrients', JSON.stringify(req.body.nutrients));

  FormDataUtil.addAttachments(
    form,
    'directionImages',
    req.attachments.directionImages,
  );
  FormDataUtil.addAttachments(form, 'video', req.attachments.video);

  config = {
    ...config,
    timeout: 60000,
    headers: {
      ContentType: 'multipart/form-data',
    },
  };

  return client.postWithAuthToken(`/api/v1/recipes`, form, config);
};

export const recipesApi = {
  postRecipe,
  getRecipe,
  getNibs,
};
