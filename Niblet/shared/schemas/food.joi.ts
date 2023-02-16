import { YupErrors } from '@shared/schemas/yupErrors';
import * as Yup from 'yup';

export const FoodYupSchema = {
  name: Yup.string()
    .min(1, YupErrors.string.min('Name'))
    .max(30, YupErrors.string.max('Name')),
  brand: Yup.string()
    .min(1, YupErrors.string.min('Brand'))
    .max(30, YupErrors.string.max('Brand')),

  servingSizeQuantity: Yup.number().positive(
    YupErrors.number.positive('Serving size quantity'),
  ),

  servingSizeUnit: Yup.string().min(
    0,
    YupErrors.string.min('Serving size unit'),
  ),

  supportedUnits: Yup.array(),

  servingSizeMetricQuantity: Yup.number()
    .integer(YupErrors.number.integer('Servings per quantity'))
    .positive(YupErrors.number.positive('Servings per quantity')),

  servingSizeMetricUnit: Yup.string().oneOf(
    ['g', 'mL'],
    `Unit must be 'g' or 'mL'`,
  ),
};
