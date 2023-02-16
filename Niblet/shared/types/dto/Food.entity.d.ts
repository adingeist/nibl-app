import { BrandDtoType } from '@shared/types/dto/Brand.entity';
import { NutrientsDtoType } from '@shared/types/dto/Nutrients.entity';
import { AllMassTypes, AllVolumeTypes } from 'easy-cook';

export type CustomUnitDtoType = {
  unit: string;
  quantity: number;
  metricQuantityPerUnit: number;
};

export type FoodDtoType = {
  id: string;
  brand: BrandDtoType | null;
  name: string;
  image?: string;
  servingSizeMetricQuantity: number;
  servingSizeMetricUnit: 'g' | 'mL';
  nutrients: NutrientsDtoType;
  density?: number;
  supportedUnits: (AllVolumeTypes | AllMassTypes | CustomUnitDtoType)[];
  createdAt?: string;
  updatedAt?: string;
};
