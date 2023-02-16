import { BaseRecipeDto } from '@shared/types/dto/Recipe.entity';
import { FoodDtoType } from '@src/shared/types/dto/Food.entity';

export interface CalendarFoodDto {
  id: string;
  food: FoodDtoType;
  servingSizeMetricQuantity: number;
}

export interface CalendarRecipeDto {
  id: string;
  recipe: BaseRecipeDto;
  servings: number;
}

export interface CalendarDateDto {
  id: string;
  date: string;
  calendarRecipes: CalendarRecipeDto[];
  calendarFoods: CalendarFoodDto[];
  createdAt: string;
  updatedAt: string;
}
