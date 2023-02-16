import { recipeYupSchema } from '@shared/schemas/recipe.joi';
import { yupObjectId } from '@shared/schemas/util.joi';
import { FoodWarningsYupSchema } from '@shared/schemas/food.warnings.joi';
import { postYupSchema } from '@shared/schemas/post.joi';
import * as Yup from 'yup';
import { YupErrors } from '@shared/schemas/yupErrors';

export const recipeRouteSchemas = {
  getRecipe: { params: Yup.object().shape({ id: yupObjectId.required() }) },

  getRecipeNibs: {
    params: Yup.object().shape({ id: yupObjectId.required() }),
    query: Yup.object().shape({
      page: Yup.number().min(0),
      perPage: Yup.number().min(1),
    }),
  },

  postRecipe: {
    body: Yup.object().shape({
      title: recipeYupSchema.title.required(YupErrors.required('Title')),
      caption: postYupSchema.caption,
      directions: recipeYupSchema.directions.required(),
      hashtags: postYupSchema.hashtags,
      ingredients: recipeYupSchema.ingredients,
      minuteDuration: recipeYupSchema.minuteDuration.required(
        YupErrors.required('Duration'),
      ),

      nutrients: recipeYupSchema.nutrients.required(),

      servingsPerRecipe: recipeYupSchema.servingsPerRecipe.required(
        YupErrors.required('Servings per recipe'),
      ),

      recipeNote: recipeYupSchema.recipeNote,
      warnings: FoodWarningsYupSchema,
    }),
  },

  deleteRecipe: { params: Yup.object().shape({ id: yupObjectId.required() }) },
};
