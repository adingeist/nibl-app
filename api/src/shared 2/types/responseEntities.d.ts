interface BaseResponseEntity {
  updatedAt: Date;
  createdAt: Date;
}

export interface HashtagResponse extends BaseResponseEntity {
  id: string;
  name: string;
}

export interface PostResponse extends BaseResponseEntity {
  caption: string;
  hashtags: HashtagResponse[] | null;
  video: string;
  banner: string;
  thumbnail: string;
}

export interface FoodResponse extends BaseResponseEntity {
  id: string;
  name: string;
  brand: BrandResponse | null;
}

export interface BrandResponse extends BaseResponseEntity {
  id: string;
  name: string;
}

export interface IngredientResponse extends BaseResponseEntity {
  id: string;
  food: FoodResponse;
  quantity: number;
  unit: string;
  ingredientNote: string;
}

export interface DirectionResponse extends BaseResponseEntity {
  id: string;
  body: string;
  stepNumber: number;
  image: string | null;
}

export interface RecipeResponse extends BaseResponseEntity {
  id: string;
  post: PostResponse;
  title: string;
  minuteDuration: number;
  ingredients: IngredientResponse[];
  directions: DirectionResponse[];
  nutrition: NutritionResponse;
  recipeNote: string;
}

export interface NibResponse extends BaseResponseEntity {
  id: string;
  post: PostResponse;
  recipe: RecipeResponse;
}

export interface NutritionResponse extends BaseResponseEntity {
  id: string;
}
