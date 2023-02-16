export const FoodWarningsValidation = {
  MAX_WARNINGS_ARRAY_LENGTH: 12,
};

export type FoodWarnings = (
  | 'milk'
  | 'tree nuts'
  | 'eggs'
  | 'peanuts'
  | 'fish'
  | 'wheat'
  | 'shellfish'
  | 'soy'
  | 'sesame'
  | 'gluten'
  | 'alcohol'
  | 'cannabis'
)[];

export const foodWarnings: FoodWarnings = [
  'milk',
  'tree nuts',
  'eggs',
  'peanuts',
  'fish',
  'wheat',
  'shellfish',
  'soy',
  'sesame',
  'gluten',
  'alcohol',
  'cannabis',
];
