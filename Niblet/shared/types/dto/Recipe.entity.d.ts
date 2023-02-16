import { RecipeIngredientDtoType } from '@shared/types/dto/RecipeIngredient.entity';
import { DirectionDtoType } from '@shared/types/dto/Direction.entity';
import { PostDtoType } from '@shared/types/dto/Post.entity';
import { BaseFeedDto } from '@shared/types/dto/FeedDto';
import { NutrientsDtoType } from '@shared/types/dto/Nutrients.entity';

interface BaseRecipeDto {
  id: string;
  nibCount: number;
  post: PostDtoType;
  title: string;
  minuteDuration: number;
  recipeNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedRecipeDtoType extends BaseRecipeDto, BaseFeedDto {
  postType: 'recipe';
}

export interface FullRecipeDtoType extends BaseRecipeDto {
  nutrients: NutrientsDtoType;
  servingsPerRecipe: number;
  servingSizeQuantity: number;
  servingSizeUnit: string;
  ingredients: RecipeIngredientDtoType[];
  directions: DirectionDtoType[];
}
