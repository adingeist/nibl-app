import { ApiError } from '@src/utils/ApiError';
import { appConfig } from '@src/utils/config';
import { auth } from '@src/middleware/auth';
import { DirectionRepository } from '@src/repository/Direction.repository';
import { FoodRepository } from '@src/repository/Food.repository';
import { HashtagRepository } from '@src/repository/Hashtag.repository';
import {
  IGetRecipe,
  IGetRecipeNibs,
  IPostRecipe,
} from '@shared/types/routes/recipe.controller';
import { appMulter } from '@src/middleware/appMulter';
import { FullRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';
import { instanceToPlain } from 'class-transformer';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { NibRepository } from '@src/repository/Nib.repository';
import { parseJSON } from '@src/middleware/parseJSON';
import { PostRepository } from '@src/repository/Post.repository';
import { postService } from '@src/services/Post.service';
import { RecipeIngredientRepository } from '@src/repository/RecipeIngredient.repository';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { RouteSchemas } from '@shared/schemas/routes';
import { storageService } from '@src/services/Storage.service';
import { User } from '@src/entities/User.entity';
import { UserRepository } from '@src/repository/User.repository';
import { v4 as uuidv4 } from 'uuid';
import { validate } from '@src/middleware/validate';
import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { floatOrUndef } from '@src/utils/floatOrUndef';
import { NutrientsRepository } from '@src/repository/Nutrients.repository';

const router = express.Router();

const upload = appMulter({
  allowedMimetypes: [
    ...appConfig.get('okImageTypes'),
    ...appConfig.get('okVideoTypes'),
  ],
});

const processDirectionImages = async (imagePaths: string[]) => {
  const processedPaths: string[] = [];

  await Promise.all(
    imagePaths.map(async (imagePath) => {
      const fileUUID = uuidv4();
      const savePath = path.resolve(`temp/uploads/${fileUUID}.jpg`);
      processedPaths.push(savePath);

      await sharp(imagePath)
        .resize({ withoutEnlargement: true, height: 1920 })
        .jpeg()
        .toFile(savePath);
    })
  );

  return processedPaths;
};

// POST /recipes
router.post<
  IPostRecipe['params'],
  IPostRecipe['res'],
  IPostRecipe['body'],
  IPostRecipe['query']
>(
  `/`,
  auth('user'),
  upload.fields([
    { name: 'video', maxCount: 20 },
    { name: 'directionImages', maxCount: 20 },
  ]),
  parseJSON,
  validate(RouteSchemas.postRecipe),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    const postedBy = await UserRepository.findOneBy({ id: userRequesting.id });

    if (!postedBy) {
      throw new ApiError(404, 'Posting user not found');
    }

    const { video: videos, directionImages } = req.files as {
      video: Express.Multer.File[];
      directionImages?: Express.Multer.File[];
    };

    let directionKeys: string[];
    if (directionImages) {
      const directionImagePaths = directionImages.map(
        (directionImage) => directionImage.path
      );

      const processedPaths = await processDirectionImages(directionImagePaths);
      directionKeys = await storageService.uploadFiles(req, ...processedPaths);
    }

    // combine videos to a single video
    if (!videos) {
      throw new ApiError(400, `A video must be uploaded`);
    }

    const videoPaths = videos.map((video) => video.path);
    const combinedVideoPath = await postService.combineVideos(videoPaths);

    // check video length
    await postService.validateVideo(combinedVideoPath);

    // resize, extract thumbnail, and extract banner
    const processedMedia = await postService.processVideo(combinedVideoPath);

    // upload videos to blob storage
    const [videoKey, bannerKey, thumbnailKey] =
      await storageService.uploadFiles(
        req,
        processedMedia.videoPath,
        processedMedia.bannerPath,
        processedMedia.thumbPath
      );

    const ingredients = await Promise.all(
      req.body.ingredients.map(async (ingredient) => {
        const food = await FoodRepository.findOneBy({ id: ingredient.foodId });

        if (!food)
          throw new ApiError(
            404,
            `Food not found with ID ${ingredient.foodId} for the given ingredients`
          );

        return RecipeIngredientRepository.create({
          food,
          ingredientNote: ingredient.ingredientNote,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        });
      })
    );

    const directions = req.body.directions.map((direction, index) => {
      return DirectionRepository.create({
        body: direction.body,
        stepNumber: index,
        imageKey: direction.directionImagesIndexPtr
          ? directionKeys[direction.directionImagesIndexPtr]
          : undefined,
      });
    });

    const hashtags = await Promise.all(
      req.body.hashtags.map(async (hashtag) => {
        const existingHashtag = await HashtagRepository.findOneBy({
          name: hashtag,
        });

        if (existingHashtag) {
          return existingHashtag;
        }

        return HashtagRepository.create({
          name: hashtag,
        });
      })
    );

    const post = PostRepository.create({
      bannerKey,
      videoKey,
      thumbnailKey,
      caption: req.body.caption,
      hashtags,
      postedBy,
    });

    const nutrients = NutrientsRepository.create(req.body.nutrients);

    let recipe = RecipeRepository.create({
      post,
      directions,
      ingredients,
      title: req.body.title,
      minuteDuration: floatOrUndef(req.body.minuteDuration),
      recipeNote: req.body.recipeNote,
      servingSizeQuantity: floatOrUndef(req.body.servingSizeQuantity),
      servingSizeUnit: req.body.servingSizeUnit,
      servingsPerRecipe: floatOrUndef(req.body.servingsPerRecipe),
      nutrients,
    });

    recipe = await RecipeRepository.save(recipe);

    const plain = instanceToPlain(recipe) as FullRecipeDtoType;

    res.status(201).send(plain);
  }
);

// GET /recipes/:id
router.get<IGetRecipe['params'], IGetRecipe['res'], IGetRecipe['body']>(
  `/:id`,
  auth('user'),
  validate(RouteSchemas.getRecipe),
  async (req, res) => {
    const user = await UserRepository.findUserRequestingOrThrow404(req);

    const id = req.params.id;

    const recipe = await RecipeRepository.getFullRecipeDtoOrThrow404(id, user);

    if (!recipe) {
      throw new ApiError(404, `Recipe not found`);
    }

    const plain = instanceToPlain(recipe) as FullRecipeDtoType;

    res.send(plain);
  }
);

// GET /recipes/:id/nibs
router.get<
  IGetRecipeNibs['params'],
  IGetRecipeNibs['res'],
  IGetRecipeNibs['body'],
  IGetRecipeNibs['query']
>(
  `/:id/nibs`,
  auth('any'),
  validate(RouteSchemas.getRecipeNibs),
  async (req, res) => {
    const recipeId = req.params.id;
    const page = Number.parseInt(req.query.page || '0');
    const perPage = Number.parseInt(req.query.perPage || '10');

    let userRequesting: User | undefined = undefined;

    if (req.user) {
      userRequesting = await UserRepository.findUserRequestingOrThrow404(req);
    }

    const [nibs, totalCount] = await NibRepository.getRecipeNibs(
      recipeId,
      page,
      perPage,
      userRequesting
    );

    res.send({
      nibs,
      ...getPaginationMetaData(page, perPage, totalCount),
    });
  }
);

export default router;
