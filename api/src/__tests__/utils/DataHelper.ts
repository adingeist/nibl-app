import { AuthToken } from '@src/entities/AuthToken.entity';
import { Brand } from '@src/entities/Brand.entity';
import { Direction } from '@src/entities/Direction.entity';
import { NutritionMetricUnit } from '@src/entities/enums/NutritionMetricUnit.enum';
import { UserRoles } from '@src/entities/enums/UserRoles.enum';
import { Food } from '@src/entities/Food.entity';
import { Hashtag } from '@src/entities/Hashtag.entity';
import { Nutrition } from '@src/entities/Nutrition.entity';
import { Post } from '@src/entities/Post.entity';
import { Recipe } from '@src/entities/Recipe.entity';
import { RecipeIngredient } from '@src/entities/RecipeIngredient.entity';
import { User } from '@src/entities/User.entity';

class DataHelperClass {
  private createdUserCount = 0;
  private createdPostCount = 0;
  private createdDirectionCount = 0;
  private createdHashtagCount = 0;
  private createdRecipeIngredientCount = 0;
  private createdFoodCount = 0;
  private createdBrandCount = 0;

  createUser(overrides: Partial<User> = {}): User {
    ++this.createdUserCount;

    const user = new User();

    user.name = overrides.name || 'Test' + this.createdUserCount;
    user.username =
      overrides.username || 'test_username' + this.createdUserCount;
    user.password = overrides.password || 'tEjcE16DJJenVZUdBK1SgsgK!';
    user.email =
      overrides.email || 'test' + this.createdUserCount + '@test.com';
    user.phone = overrides.phone || '0000000000' + this.createdUserCount;
    user.birthday = overrides.birthday || new Date(0);
    user.role = overrides.role || UserRoles.USER;
    user.profileImageKey =
      overrides.profileImageKey || 'default' + this.createdUserCount;
    user.likeCount = overrides.likeCount || 0;
    user.isVerified = overrides.isVerified || false;
    user.emailIsVerified = overrides.emailIsVerified || false;
    user.phoneIsVerified = overrides.phoneIsVerified || false;
    user.recipeCount = overrides.recipeCount || 0;

    return user;
  }

  createAuthToken(overrides: Partial<AuthToken>): AuthToken {
    const token = new AuthToken();

    token.user = overrides.user || this.createUser();
    token.attempts = overrides.attempts || 0;
    token.pin =
      overrides.pin || Math.floor((Math.random() * 10) ^ 10).toString();
    token.sentToEmail = overrides.sentToEmail || false;
    token.sentToPhone = overrides.sentToPhone || false;

    const now = new Date();
    token.expiresAt =
      overrides.expiresAt ||
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 15
      );

    return token;
  }

  createHashtag(overrides?: Partial<Hashtag>): Hashtag {
    this.createdHashtagCount++;

    let hashtag = new Hashtag();
    hashtag = {
      ...hashtag,
      name: `hashtag${this.createdHashtagCount}`,
      ...overrides,
    };

    return hashtag;
  }

  createPost(overrides?: Partial<Post>): Post {
    let post = new Post();
    post = {
      ...post,
      postedBy: this.createUser(),
      caption: `caption ${this.createdPostCount}`,
      hashtags: [this.createHashtag()],
      videoKey: `video-key-${this.createdPostCount}`,
      bannerKey: `video-banner-key-${this.createdPostCount}`,
      thumbnailKey: `video-thumbnail-key-${this.createdPostCount}`,
      ...overrides,
    };

    return post;
  }

  createRecipe(overrides?: Partial<Recipe>): Recipe {
    this.createdPostCount++;

    let recipe = new Recipe();
    recipe = {
      ...recipe,
      title: `recipe title ${this.createdPostCount}`,
      minuteDuration: this.createdPostCount + 1,
      nutrition: this.createNutrition(),
      recipeNote: `recipe note ${this.createdPostCount}`,
      post: this.createPost(),
      ...overrides,
    };

    recipe.directions = [this.createDirection({ recipe })];
    recipe.ingredients = [this.createRecipeIngredient({ recipe })];

    return recipe;
  }

  createRecipeIngredient(
    overrides: Partial<RecipeIngredient> & {
      recipe: RecipeIngredient['recipe'];
    }
  ): RecipeIngredient {
    this.createdRecipeIngredientCount++;

    let ingredient = new RecipeIngredient();
    ingredient = {
      ...ingredient,
      food: this.createFood(),
      ingredientNote: `ingredient note ${this.createdRecipeIngredientCount}`,
      unit: NutritionMetricUnit.GRAMS,
      quantity: 1,
      ...overrides,
    };

    return ingredient;
  }

  createFood(overrides?: Partial<Food>): Food {
    this.createdFoodCount;

    let food = new Food();
    food = {
      ...food,
      brand: this.createBrand(),
      name: `food name ${this.createdFoodCount}`,
      nutrition: this.createNutrition(),
      ...overrides,
    };

    return food;
  }

  createBrand(overrides?: Partial<Brand>): Brand {
    this.createdBrandCount++;

    let brand = new Brand();
    brand = {
      ...brand,
      name: `brand name ${this.createdBrandCount}`,
      ...overrides,
    };

    return brand;
  }

  createDirection(
    overrides: Partial<Direction> & { recipe: Direction['recipe'] }
  ): Direction {
    this.createdDirectionCount++;

    let direction = new Direction();
    direction = {
      ...direction,
      body: `direction ${this.createdDirectionCount}`,
      imageKey: 'image_key',
      stepNumber: this.createdDirectionCount,
      ...overrides,
      recipe: overrides.recipe,
    };

    return direction;
  }

  createNutrition(overrides?: Partial<Nutrition>): Nutrition {
    let nutrition: Nutrition;
    nutrition = new Nutrition();
    nutrition = {
      ...nutrition,
      servingSizeMetricQuantity: 1,
      servingSizeMetricUnit: NutritionMetricUnit.GRAMS,
      servingSizeQuantity: 1,
      servingSizeUnit: 'bag',
      containerMetricQuantity: 1,
      containerMetricUnit: NutritionMetricUnit.GRAMS,
      calories: 1,

      totalFat: 1,
      saturatedFat: 1,
      transFat: 1,
      monounsaturatedFat: 1,
      polyunsaturatedFat: 1,

      cholesterol: 1,
      sodium: 1,

      totalCarbohydrates: 1,
      dietaryFiber: 1,
      sugars: 1,
      sugarAlcohol: 1,
      addedSugars: 1,

      protein: 1,

      calcium: 1,
      iron: 1,
      vitaminD: 1,
      potassium: 1,

      vitaminA: 1,
      vitaminC: 1,
      vitaminE: 1,
      vitaminK: 1,
      thiamin: 1,
      riboflavin: 1,
      niacin: 1,
      vitaminB6: 1,
      folicAcid: 1,
      vitaminB12: 1,
      biotin: 1,
      pantothenicAcid: 1,
      phosphorus: 1,
      iodine: 1,
      magnesium: 1,
      zinc: 1,
      selenium: 1,
      copper: 1,
      manganese: 1,
      chromium: 1,
      molybdenum: 1,
      chloride: 1,

      caffeine: 1,

      ...overrides,
    };

    return nutrition;
  }
}

export const DataHelper = new DataHelperClass();
