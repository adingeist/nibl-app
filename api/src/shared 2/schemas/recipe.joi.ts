import { FoodWarningsYupSchema } from '@shared/schemas/food.warnings.joi';
import * as Yup from 'yup';
import { YupErrors } from '@shared/schemas/yupErrors';
import { yupObjectId } from '@shared/schemas/util.joi';
import { NutrientYupSchema } from '@shared/schemas/nutrients.yup';

const recipeIngredientItemYupSchema = {
  foodId: yupObjectId,
  recipeId: yupObjectId,
  quantity: Yup.number()
    .typeError("Ingredient quantity isn't a number")
    .integer(YupErrors.number.integer('Quantity'))
    .min(1, YupErrors.number.min('Quantity'))
    .max(9999, YupErrors.number.max('Quantity')),
  unit: Yup.string().max(100, YupErrors.string.max('Unit')),
  ingredientNote: Yup.string().max(
    200,
    YupErrors.string.max('Ingredient note'),
  ),
};

const direction = Yup.object({
  body: Yup.string()
    .min(1, YupErrors.string.min('Direction'))
    .max(500, YupErrors.string.max('Direction')),
  directionImagesIndexPtr: Yup.number().min(0),
});

export const recipeYupSchema = {
  title: Yup.string()
    .min(3, YupErrors.string.min('Title'))
    .max(30, YupErrors.string.max('Title')),

  minuteDuration: Yup.number().min(0, YupErrors.number.min('Duration')),

  ingredients: Yup.array()
    .of(Yup.object(recipeIngredientItemYupSchema))
    .min(1)
    .max(20),

  directions: Yup.array().of(direction).min(1).max(20),

  servingsPerRecipe: Yup.string(),

  recipeNote: Yup.string().max(3000, YupErrors.string.max('Recipe note')),

  warnings: FoodWarningsYupSchema,

  nutrients: Yup.object(NutrientYupSchema),
};
