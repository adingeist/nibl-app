import { foodWarnings } from '@shared/validation/food.warnings.validation';
import * as Yup from 'yup';

export const FoodWarningsYupSchema = Yup.array()
  .of(Yup.string().oneOf(foodWarnings))
  .max(foodWarnings.length);
