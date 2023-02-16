import { YupErrors } from '@shared/schemas/yupErrors';
import * as Yup from 'yup';

export const NutrientYupSchema = {
  calories: Yup.number().min(0, YupErrors.number.min('Calories')),

  totalFat: Yup.number().min(0, YupErrors.number.min('Total fat')),
  saturatedFat: Yup.number().min(0, YupErrors.number.min('Saturated fat')),
  transFat: Yup.number().min(0, YupErrors.number.min('Trans fat')),
  polyunsaturatedFat: Yup.number().min(
    0,
    YupErrors.number.min('Polyunsaturated fat')
  ),
  monounsaturatedFat: Yup.number().min(
    0,
    YupErrors.number.min('Monounsaturated fat')
  ),

  cholesterol: Yup.number().min(0, YupErrors.number.min('cholesterol')),
  sodium: Yup.number().min(0, YupErrors.number.min('sodium')),

  totalCarbohydrates: Yup.number().min(
    0,
    YupErrors.number.min('Total carbohydrates')
  ),
  dietaryFiber: Yup.number().min(0, YupErrors.number.min('Dietary fiber')),
  sugars: Yup.number().min(0, YupErrors.number.min('Sugars')),
  addedSugars: Yup.number().min(0, YupErrors.number.min('Added sugars')),
  sugarAlcohol: Yup.number().min(0, YupErrors.number.min('Sugar alcohol')),

  protein: Yup.number().min(0, YupErrors.number.min('Protein')),

  calcium: Yup.number().min(0, YupErrors.number.min('Calcium')),
  iron: Yup.number().min(0, YupErrors.number.min('Iron')),
  vitaminD: Yup.number().min(0, YupErrors.number.min('Vitamin D')),
  potassium: Yup.number().min(0, YupErrors.number.min('Potassium')),

  vitaminA: Yup.number().min(0, YupErrors.number.min('Vitamin A')),
  vitaminC: Yup.number().min(0, YupErrors.number.min('Vitamin C')),
  vitaminE: Yup.number().min(0, YupErrors.number.min('Vitamin E')),
  vitaminK: Yup.number().min(0, YupErrors.number.min('Vitamin K')),
  thiamin: Yup.number().min(0, YupErrors.number.min('Thiamin')),
  riboflavin: Yup.number().min(0, YupErrors.number.min('Riboflavin')),
  niacin: Yup.number().min(0, YupErrors.number.min('Niacin')),
  vitaminB6: Yup.number().min(0, YupErrors.number.min('Vitamin B6')),
  folicAcid: Yup.number().min(0, YupErrors.number.min('Folic acid')),
  vitaminB12: Yup.number().min(0, YupErrors.number.min('Vitamin B12')),
  biotin: Yup.number().min(0, YupErrors.number.min('Biotin')),
  pantothenicAcid: Yup.number().min(
    0,
    YupErrors.number.min('Pantothenic acid')
  ),
  phosphorus: Yup.number().min(0, YupErrors.number.min('Phosphorus')),
  iodine: Yup.number().min(0, YupErrors.number.min('Iodine')),
  magnesium: Yup.number().min(0, YupErrors.number.min('Magnesium')),
  zinc: Yup.number().min(0, YupErrors.number.min('Zinc')),
  selenium: Yup.number().min(0, YupErrors.number.min('Selenium')),
  copper: Yup.number().min(0, YupErrors.number.min('Copper')),
  manganese: Yup.number().min(0, YupErrors.number.min('Manganese')),
  chromium: Yup.number().min(0, YupErrors.number.min('Chromium')),
  molybdenum: Yup.number().min(0, YupErrors.number.min('Molybdenum')),
  chloride: Yup.number().min(0, YupErrors.number.min('Chloride')),

  caffeine: Yup.number().min(0, YupErrors.number.min('Caffeine')),
};
