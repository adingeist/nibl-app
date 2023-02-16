import { ApiError } from '@src/utils/ApiError';
import { auth } from '@src/middleware/auth';
import {
  FeedRecipeOrNibDtoType,
  IGetFeed,
  IGetFollowingFeed,
} from '@shared/types/routes/feed.controller';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { NibRepository } from '@src/repository/Nib.repository';
import { PostInFeedRepository } from '@src/repository/PostInFeed.repository';
import { PostRepository } from '@src/repository/Post.repository';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { RouteSchemas } from '@shared/schemas/routes';
import { UserRepository } from '@src/repository/User.repository';
import { validate } from '@src/middleware/validate';
import express from 'express';

const router = express.Router();

// GET /feed
router.get<
  IGetFeed['params'],
  IGetFeed['res'],
  IGetFeed['body'],
  IGetFeed['query']
>('/feed', auth('user'), async (req, res) => {
  const userRequesting = await UserRepository.findOneBy({
    id: (req.user as JWTUserPayload).id,
  });

  if (!userRequesting) {
    throw new ApiError(404, 'User requesting not found');
  }

  const feedRecipesDto = await RecipeRepository.getFeedRecipesDto(
    userRequesting,
  );

  // Do not allow post to be included in future feed requests
  await Promise.all(
    feedRecipesDto.map(async (feedRecipeDto) => {
      const postInFeed = PostInFeedRepository.create({
        post: feedRecipeDto.post,
        user: userRequesting,
      });
      await PostInFeedRepository.save(postInFeed);
    }),
  );

  res.send({ posts: feedRecipesDto, pageCount: undefined });
});

// GET /following-feed
router.get<
  IGetFollowingFeed['params'],
  IGetFollowingFeed['res'],
  IGetFollowingFeed['body'],
  IGetFollowingFeed['query']
>(
  '/following-feed',
  auth('user'),
  validate(RouteSchemas.getFollowingFeed),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    const page = req.query.page ? Number.parseInt(req.query.page) : 0;
    const take = req.query.perPage ? Number.parseInt(req.query.perPage) : 10;
    const skip = page * take;

    const [postDtos, totalCount] = await PostRepository.getFollowingFeedPosts(
      userRequesting.id,
      take,
      skip,
    );

    const postIds = postDtos.map((post) => {
      return post.id;
    });

    const recipeDtos = await RecipeRepository.getFollowerFeedRecipesDto(
      postDtos,
      postIds,
    );

    const nibDtos = await NibRepository.getFollowerFeedNibsDto(
      postDtos,
      postIds,
    );

    const recipeOrNibDtos: FeedRecipeOrNibDtoType[] = [
      ...recipeDtos,
      ...nibDtos,
    ].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    res.send({
      posts: recipeOrNibDtos,
      ...getPaginationMetaData(page, take, totalCount),
    });
  },
);

export default router;
