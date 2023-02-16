import { FullRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';
import { PaginationRes } from '@shared/types/dto/Pagination';
import { NutrientsJSONBody } from '@shared/types/nutrients';

type RecipeIngredientType = {
  foodId: string;
  quantity: number;
  unit: string;
  ingredientNote: string;
};

export type IGetRecipe = {
  params: { id: string };
  res: FullRecipeDtoType;
  body: Record<string, never>;
  query?: undefined;
};

export type IGetRecipeNibs = {
  params: { id: string };
  res: {
    nibs: FeedNibDtoType[];
  } & PaginationRes;
  body: Record<string, never>;
  query: { page?: string; perPage?: string };
};

export type PostRecipeDirectionType = {
  body: string;
  directionImagesIndexPtr?: number;
};

export type IPostRecipe = {
  params: Record<string, never>;
  res: FullRecipeDtoType;
  body: {
    title: string;
    ingredients: RecipeIngredientType[];
    directions: PostRecipeDirectionType[];
    nutrients: NutrientsJSONBody;
    minuteDuration: string;
    servingSizeQuantity: string;
    servingSizeUnit: string;
    servingsPerRecipe: string;
    recipeNote?: string;
    caption?: string;
    hashtags: string[];
    warnings: string[];
  };
  query: Record<string, never>;
  attachments: {
    video: string[];
    directionImages: string[];
  };
};

export type IDeleteRecipe = {
  params: { id: string };
  response: Record<string, never>;
  body: Record<string, never>;
  query: Record<string, never>;
};
