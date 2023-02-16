export type RecipeIngredientDtoType = {
  id: string;
  recipeId?: string;
  food: {
    id: string;
    brand: {
      id: string;
      name: string;
    } | null;
    name: string;
    image?: string;
  };
  quantity: number;
  unit: string;
  ingredientNote: string;
};
