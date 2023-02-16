import { ApiError } from '@src/utils/ApiError';
import { AppDataSource } from '@src/start/db';
import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { FollowerRepository } from '@src/repository/Follower.repository';
import { instanceToPlain } from 'class-transformer';
import { Nutrients } from '@src/entities/Nutrients.entity';
import { Post } from '@src/entities/Post.entity';
import { PostInFeed } from '@src/entities/PostInFeed.entity';
import { PostLikeRepository } from '@src/repository/PostLike.repository';
import { Recipe } from '@src/entities/Recipe.entity';
import { User } from '@src/entities/User.entity';
import { In } from 'typeorm';
import { PostDtoType } from '@src/shared/types/dto/Post.entity';

const setRequesterLikedAndIsFollowingForMany = (
  recipes: Recipe[],
  userRequesting?: User,
) =>
  Promise.all(
    recipes.map((recipe) =>
      setRequesterLikedAndIsFollowing(recipe, userRequesting),
    ),
  );

const setRequesterLikedAndIsFollowing = async (
  recipe: Recipe,
  userRequesting?: User,
) => {
  const recipeDto = instanceToPlain(recipe) as Omit<
    FeedRecipeDtoType,
    'post.requesterLiked' | 'postType' | 'post.postedBy.requesterIsFollowing'
  >;

  const [requesterLiked, requesterIsFollowing] = await Promise.all([
    userRequesting
      ? PostLikeRepository.isPostIdLikedByUserId(
          recipeDto.post.id,
          userRequesting.id,
        )
      : Promise.resolve(false),
    userRequesting
      ? FollowerRepository.isUserIdFollowingUserId(
          userRequesting.id,
          recipeDto.post.postedBy.id,
        )
      : Promise.resolve(false),
  ]);

  const feedRecipeDto: FeedRecipeDtoType = {
    ...recipeDto,
    post: {
      ...recipeDto.post,
      requesterLiked,
      postedBy: {
        ...recipeDto.post.postedBy,
        requesterIsFollowing,
      },
    },
    postType: 'recipe',
  };

  return feedRecipeDto;
};

export const RecipeRepository = AppDataSource.getRepository(Recipe).extend({
  async getFullRecipeDtoOrThrow404(recipeId: string, userRequesting: User) {
    const recipe = await this.createQueryBuilder('r')
      .where('r.id = :id', { id: recipeId })
      .innerJoinAndMapOne('r.post', Post, 'p', 'p.id = r.post_id')
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'postedBy',
        'p.posted_by_id = postedBy.id',
      )
      .leftJoinAndMapOne(
        'r.nutrients',
        Nutrients,
        'nutrients',
        'r.nutrients_id = nutrients.id',
      )
      .leftJoinAndMapMany('r.ingredients', 'r.ingredients', 'ingredients')
      .leftJoinAndMapOne('ingredients.food', 'ingredients.food', 'food')
      .leftJoinAndMapOne('food.brand', 'food.brand', 'brand')
      .leftJoinAndMapMany('r.directions', 'r.directions', 'directions')
      .loadRelationCountAndMap('r.nibCount', 'r.nibs')
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .getOne();

    if (!recipe) {
      throw new ApiError(404, 'Recipe not found');
    }

    const recipeDto = await setRequesterLikedAndIsFollowing(
      recipe,
      userRequesting,
    );

    return recipeDto;
  },

  async getFollowerFeedRecipesDto(postDtos: PostDtoType[], postIds: string[]) {
    const recipes = await this.find({
      where: { post: { id: In(postIds) } },
      relations: { post: true },
    });

    const recipeDtos = recipes.map((recipe) => {
      const recipeDto = recipe as unknown as FeedRecipeDtoType;
      const postIndex = postDtos.findIndex(
        (post) => recipeDto.post.id === post.id,
      );
      recipeDto.post = postDtos[postIndex];
      return instanceToPlain(recipeDto);
    }) as FeedRecipeDtoType[];

    return recipeDtos;
  },

  async getFeedRecipesDto(userRequesting: User) {
    const recipes = (await this.createQueryBuilder('r')
      .innerJoinAndMapOne('r.post', Post, 'p', 'p.id = r.post_id')
      .leftJoinAndSelect(PostInFeed, 'pif', 'pif.post_id = p.id')
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'postedBy',
        'p.posted_by_id = postedBy.id',
      )
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .where('pif.id IS NULL OR pif.user_id != :id', { id: userRequesting.id })
      .take(3)
      .getMany()) as (Recipe & {
      post: { likeCount: number; commentCount: number };
    })[];

    const feedRecipesDto = await setRequesterLikedAndIsFollowingForMany(
      recipes,
      userRequesting,
    );

    return feedRecipesDto;
  },

  async getUsernamesRecipesDtoAndCount(
    username: string,
    skip: number,
    take: number,
  ): Promise<[FeedRecipeDtoType[], number]> {
    const [recipes, totalCount] = await this.createQueryBuilder('r')
      .innerJoinAndMapOne('r.post', Post, 'p', 'p.id = r.post_id')
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'postedBy',
        'p.posted_by_id = postedBy.id',
      )
      .where('postedBy.username = :username', { username })
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .skip(skip)
      .take(take)
      .orderBy('p.createdAt', 'DESC')
      .getManyAndCount();

    const feedRecipeDtos = await setRequesterLikedAndIsFollowingForMany(
      recipes,
    );

    return [feedRecipeDtos, totalCount];
  },
});
