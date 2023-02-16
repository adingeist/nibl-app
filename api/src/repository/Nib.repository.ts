import { AppDataSource } from '@src/start/db';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';
import { instanceToPlain } from 'class-transformer';
import { Nib } from '@src/entities/Nib.entity';
import { Post } from '@src/entities/Post.entity';
import { User } from '@src/entities/User.entity';
import { PostLikeRepository } from '@src/repository/PostLike.repository';
import { FollowerRepository } from '@src/repository/Follower.repository';
import { PostDtoType } from '@src/shared/types/dto/Post.entity';
import { In } from 'typeorm';

const setRequesterLikedAndIsFollowing = async (
  nibs: Nib[],
  userRequesting?: User,
) => {
  const nibDtos = instanceToPlain(nibs) as Omit<
    FeedNibDtoType[],
    'post.requesterLiked' | 'postType' | 'post.postedBy.requesterIsFollowing'
  >;

  const feedNibsDto: FeedNibDtoType[] = await Promise.all(
    nibDtos.map(async (nibDto) => {
      const [requesterLiked, requesterIsFollowing] = await Promise.all([
        userRequesting
          ? PostLikeRepository.isPostIdLikedByUserId(
              nibDto.post.id,
              userRequesting.id,
            )
          : Promise.resolve(false),
        userRequesting
          ? FollowerRepository.isUserIdFollowingUserId(
              userRequesting.id,
              nibDto.post.postedBy.id,
            )
          : Promise.resolve(false),
      ]);

      const feedNibDto: FeedNibDtoType = {
        ...nibDto,
        post: {
          ...nibDto.post,
          requesterLiked,
          postedBy: {
            ...nibDto.post.postedBy,
            requesterIsFollowing,
          },
        },
        postType: 'nib',
      };

      return feedNibDto;
    }),
  );
  return feedNibsDto;
};

export const NibRepository = AppDataSource.getRepository(Nib).extend({
  async getRecipeNibs(
    recipeId: string,
    skip: number,
    take: number,
    userRequesting?: User,
  ): Promise<[FeedNibDtoType[], number]> {
    const [nibs, totalCount] = await this.createQueryBuilder('nib')
      .where('nib.recipe_id = :recipeId', { recipeId })
      .innerJoinAndMapOne('nib.post', Post, 'p', 'p.id = nib.post_id')
      .leftJoinAndMapOne(
        'p.postedBy',
        User,
        'postedBy',
        'p.posted_by_id = postedBy.id',
      )
      .loadRelationCountAndMap('p.likeCount', 'p.likes')
      .loadRelationCountAndMap('p.commentCount', 'p.comments')
      .skip(skip)
      .take(take)
      .orderBy('p.createdAt', 'DESC')
      .getManyAndCount();

    const feedNibsDto = await setRequesterLikedAndIsFollowing(
      nibs,
      userRequesting,
    );

    return [feedNibsDto, totalCount];
  },

  async getFollowerFeedNibsDto(postDtos: PostDtoType[], postIds: string[]) {
    const nibs = await this.find({
      where: { post: { id: In(postIds) } },
      relations: { post: true },
    });

    const nibDtos = nibs.map((nib) => {
      const nibDto = nib as unknown as FeedNibDtoType;
      const postIndex = postDtos.findIndex(
        (post) => nibDto.post.id === post.id,
      );
      nibDto.post = postDtos[postIndex];
      return instanceToPlain(nibDto);
    }) as FeedNibDtoType[];

    return nibDtos;
  },

  async getUsernamesNibDtosAndCount(
    username: string,
    skip: number,
    take: number,
    userRequesting?: User,
  ): Promise<[FeedNibDtoType[], number]> {
    const [nibs, totalCount] = await this.createQueryBuilder('nib')
      .innerJoinAndMapOne('nib.post', Post, 'p', 'p.id = nib.post_id')
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

    const feedNibsDto = await setRequesterLikedAndIsFollowing(
      nibs,
      userRequesting,
    );

    return [feedNibsDto, totalCount];
  },
});
