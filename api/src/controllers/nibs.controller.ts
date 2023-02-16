import { ApiError } from '@src/utils/ApiError';
import { appConfig } from '@src/utils/config';
import { auth } from '@src/middleware/auth';
import { instanceToPlain } from 'class-transformer';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { parseJSON } from '@src/middleware/parseJSON';
import { PostRepository } from '@src/repository/Post.repository';
import { postService } from '@src/services/Post.service';
import { RouteSchemas } from '@shared/schemas/routes';
import { storageService } from '@src/services/Storage.service';
import { UserRepository } from '@src/repository/User.repository';
import { validate } from '@src/middleware/validate';
import express from 'express';
import { appMulter } from '@src/middleware/appMulter';
import { NibRepository } from '@src/repository/Nib.repository';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { IPostNib } from '@shared/types/routes/nib.controller';
import { NibDto } from '@shared/types/dto/Nib.entity';
import { NotificationsService } from '@src/services/Notifications.service';

const router = express.Router();

const upload = appMulter({ allowedMimetypes: appConfig.get('okVideoTypes') });

// POST /nibs
router.post<
  IPostNib['params'],
  IPostNib['res'],
  IPostNib['body'],
  IPostNib['query']
>(
  `/`,
  auth('user'),
  upload.fields([{ name: 'video', maxCount: 20 }]),
  parseJSON,
  validate(RouteSchemas.postNib),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    const postedBy = await UserRepository.findOneBy({ id: userRequesting.id });

    if (!postedBy) {
      throw new ApiError(404, 'Posting user not found');
    }

    const recipe = await RecipeRepository.findOne({
      where: { id: req.body.recipeId },
      relations: { post: { postedBy: true } },
    });

    if (!recipe) {
      throw new ApiError(404, 'Recipe not found');
    }

    const { video: videos } = req.files as {
      video: Express.Multer.File[];
    };

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

    // TODO : PROCESS HASHTAGS IN NIB AND RECIPES

    const post = PostRepository.create({
      bannerKey,
      videoKey,
      thumbnailKey,
      caption: req.body.caption,
      hashtags: [],
      postedBy,
    });

    let nib = NibRepository.create({
      post,
      recipe,
    });

    nib = await NibRepository.save(nib);

    // Notify the recipe creator that their recipe was nibbed
    NotificationsService.sendRecipeNibbedNotification(
      recipe.post.postedBy.id,
      postedBy,
      nib,
      recipe
    );

    const plain = instanceToPlain(nib) as NibDto;

    res.status(201).send(plain);
  }
);

export default router;
