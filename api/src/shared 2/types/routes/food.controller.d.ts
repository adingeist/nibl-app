import { CustomUnitDtoType, FoodDtoType } from '@shared/types/dto/Food.entity';
import { FormFile } from '@shared/types/File';
import { NutritionMetricUnitString } from '@shared/types/nutrients';
import { AllMassTypes, AllVolumeTypes } from 'easy-cook';

export type ISearchFood = {
  params: Record<string, never>;
  body: Record<string, never>;
  query: {
    str: string;
    page?: number;
  };
  res: {
    count: number;
    foods: FoodDtoType[];
  };
};

export type IGetFood = {
  params: { id: string };
  query: Record<string, never>;
  body: Record<string, never>;
  res: FoodDtoType;
};

export type IPostFood = {
  params: Record<string, never>;
  query: Record<string, never>;
  body: {
    name: string;
    brand?: string;
    servingSizeQuantity?: string;
    servingSizeUnit?: string;
    servingSizeMetricQuantity: string;
    supportedUnits: (AllVolumeTypes | AllMassTypes | CustomUnitDtoType)[];
    density?: string;
    servingSizeMetricUnit: NutritionMetricUnitString;
    nutrients: {
      calories?: number;
      totalFat?: number;
      saturatedFat?: number;
      polyunsaturatedFat?: number;
      monounsaturatedFat?: number;
      cholesterol?: number;
      sodium?: number;
      totalCarbohydrates?: number;
      dietaryFiber?: number;
      sugars?: number;
      addedSugars?: number;
      sugarAlcohol?: number;
      protein?: number;
      calcium?: number;
      iron?: number;
      vitaminD?: number;
      potassium?: number;
      vitaminA?: number;
      vitaminC?: number;
      vitaminK?: number;
      thiamin?: number;
      riboflavin?: number;
      niacin?: number;
      vitaminB6?: number;
      folicAcid?: number;
      vitaminB12?: number;
      biotin?: number;
      pantothenicAcid?: number;
      phosphorus?: number;
      iodine?: number;
      magnesium?: number;
      zinc?: number;
      selenium?: number;
      copper?: number;
      manganese?: number;
      chromium?: number;
      molybdenum?: number;
      chloride?: number;
      caffeine?: number;
    };
  };
  attachments: {
    image?: FormFile;
  };
  res: FoodDtoType;
};
