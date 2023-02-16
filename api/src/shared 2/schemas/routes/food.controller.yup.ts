import { FoodWarningsYupSchema } from '@shared/schemas/food.warnings.joi';
import { FoodYupSchema } from '@shared/schemas/food.joi';
import { YupErrors } from '@shared/schemas/yupErrors';
import { yupObjectId } from '@shared/schemas/util.joi';
import * as Yup from 'yup';
import { NutrientYupSchema } from '@shared/schemas/nutrients.yup';

export const foodRouteSchemas = {
  getFood: {
    params: Yup.object().shape({ id: yupObjectId }),
  },

  postFood: {
    body: Yup.object().shape({
      name: FoodYupSchema.name.required(YupErrors.required('Name')),
      brand: FoodYupSchema.brand,
      warnings: FoodWarningsYupSchema,

      servingSizeQuantity: FoodYupSchema.servingSizeQuantity.required(),
      servingSizeUnit: FoodYupSchema.servingSizeUnit.required(),
      supportedUnits: FoodYupSchema.supportedUnits.required(),

      servingSizeMetricQuantity: FoodYupSchema.servingSizeMetricQuantity
        .required(),
      servingSizeMetricUnit: FoodYupSchema.servingSizeMetricUnit.required(),

      nutrients: Yup.object({
        ...NutrientYupSchema,

        calories: NutrientYupSchema.calories.required(
          YupErrors.required('Calories'),
        ),
        totalFat: NutrientYupSchema.totalFat.required(
          YupErrors.required('Total fat'),
        ),
        saturatedFat: NutrientYupSchema.saturatedFat.required(
          YupErrors.required('Saturated fat'),
        ),
        cholesterol: NutrientYupSchema.cholesterol.required(
          YupErrors.required('Cholesterol'),
        ),
        sodium: NutrientYupSchema.sodium.required(YupErrors.required('Sodium')),

        totalCarbohydrates: NutrientYupSchema.totalCarbohydrates.required(
          YupErrors.required('Total carbohydrates'),
        ),
        dietaryFiber: NutrientYupSchema.dietaryFiber.required(
          YupErrors.required('Dietary fiber'),
        ),
        sugars: NutrientYupSchema.sugars.required(YupErrors.required('Sugars')),
        addedSugars: NutrientYupSchema.addedSugars.required(
          YupErrors.required('Added sugars'),
        ),
        protein: NutrientYupSchema.protein.required(
          YupErrors.required('Protein'),
        ),
      }),
    }),
  },

  updateFood: {
    params: { id: yupObjectId.required() },
    body: FoodYupSchema,
  },

  deleteFood: {
    params: {
      id: yupObjectId.required(),
    },
  },
};
