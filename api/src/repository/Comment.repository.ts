import { Comment } from '@src/entities/Comment.entity';
import { CommentDto } from '@shared/types/dto/Comment.entity';
import { AppDataSource } from '@src/start/db';

export const CommentRepository = AppDataSource.getRepository(Comment).extend({
  async findOnPost(
    postId: string,
    userId: string | undefined,
    skip: number,
    take: number,
  ): Promise<[comments: CommentDto[], totalCount: number]> {
    const [comments, totalCount] = (await this.createQueryBuilder('c')
      .where('c.on_post_id = :postId', { postId })
      .andWhere('c.root_parent_id IS NULL')
      .addOrderBy('c.createdAt', 'DESC')
      .loadRelationCountAndMap('c.likeCount', 'c.likes')
      .loadRelationCountAndMap('c.replyCount', 'c.children')
      .leftJoinAndMapOne('c.postedBy', 'c.postedBy', 'postedBy')
      .loadRelationIdAndMap('c.rootParentId', 'c.rootParent')
      .leftJoinAndMapOne('c.firstParent', 'c.firstParent', 'firstParent')
      .loadRelationIdAndMap('c.onPostId', 'c.onPost')
      .loadRelationCountAndMap('c.requesterLiked', 'c.likes', 'like', (query) =>
        query.where('like.likedBy = :userId', { userId }),
      )
      .skip(skip)
      .take(take)
      .getManyAndCount()) as [
      comments: (Comment & { requesterLiked: number })[],
      totalCount: number,
    ];

    const commentsDto = comments.map((comment) => ({
      ...comment,
      requesterLiked: comment.requesterLiked > 0,
    })) as unknown as CommentDto[];

    return [commentsDto, totalCount];
  },

  async findRepliesOnPost(
    postId: string,
    commentId: string,
    userId: string | undefined,
    skip: number,
    take: number,
  ): Promise<[comments: CommentDto[], totalCount: number]> {
    const [comments, totalCount] = (await this.createQueryBuilder('c')
      .where('c.on_post_id = :postId', { postId })
      .andWhere('c.root_parent_id = :commentId', { commentId })
      .loadRelationCountAndMap('c.likeCount', 'c.likes')
      .loadRelationCountAndMap('c.replyCount', 'c.children')
      .leftJoinAndMapOne('c.postedBy', 'c.postedBy', 'postedBy')
      .loadRelationIdAndMap('c.rootParentId', 'c.rootParent')
      .leftJoinAndMapOne('c.firstParent', 'c.firstParent', 'firstParent')
      .leftJoinAndMapOne(
        'firstParent.postedBy',
        'firstParent.postedBy',
        'firstParentPostedBy',
      )
      .loadRelationIdAndMap('c.onPostId', 'c.onPost')
      .loadRelationCountAndMap('c.requesterLiked', 'c.likes', 'like', (query) =>
        query.where('like.likedBy = :userId', { userId }),
      )
      .orderBy('c.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount()) as [
      comments: (Comment & { requesterLiked: number })[],
      totalCount: number,
    ];

    const commentsDto = comments.map((comment) => ({
      ...comment,
      requesterLiked: comment.requesterLiked > 0,
    })) as unknown as CommentDto[];

    return [commentsDto, totalCount];
  },
});
