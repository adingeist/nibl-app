import { auth } from '@src/middleware/auth';
import { validate } from '@src/middleware/validate';
import { CommentRepository } from '@src/repository/Comment.repository';
import { PostRepository } from '@src/repository/Post.repository';
import { RouteSchemas } from '@shared/schemas/routes';
import {
  IDeleteComment,
  IGetCommentReplies,
  IGetComments,
  IPostComment,
} from '@shared/types/routes/comment.controller';
import { ApiError } from '@src/utils/ApiError';
import express from 'express';
import { Comment } from '@src/entities/Comment.entity';
import { UserRepository } from '@src/repository/User.repository';
import { instanceToPlain } from 'class-transformer';
import { CommentDto } from '@shared/types/dto/Comment.entity';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';

const router = express.Router();

// POST /posts/:postId/comments
router.post<
  IPostComment['params'],
  IPostComment['res'],
  IPostComment['body'],
  IPostComment['query']
>(
  '/posts/:postId/comments',
  auth('user'),
  validate(RouteSchemas.postComment),
  async (req, res) => {
    const postId = req.params.postId;
    const rootParentId = req.body.rootParentId;
    const firstParentId = req.body.firstParentId;

    const postedBy = await UserRepository.findUserRequestingOrThrow404(req);

    const post = await PostRepository.findOneBy({ id: postId });

    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    let firstParent: Comment | null = null;
    let rootParent: Comment | null = null;

    if (rootParentId && firstParentId) {
      rootParent = await CommentRepository.findOneBy({ id: rootParentId });
      firstParent = await CommentRepository.findOneBy({ id: firstParentId });

      if (!rootParent || !firstParent) {
        throw new ApiError(404, 'Parent comment not found');
      }
    }

    let comment = CommentRepository.create({
      body: req.body.body,
      onPost: post,
      rootParent,
      firstParent,
      postedBy,
    });

    comment = await CommentRepository.save(comment);

    const commentDto = instanceToPlain(comment) as CommentDto;

    res.send({
      id: commentDto.id,
      postedBy: {
        id: commentDto.postedBy.id,
        username: commentDto.postedBy.username,
        profileImage: commentDto.postedBy.profileImage,
      },
      body: commentDto.body,
      rootParentId: rootParentId,
      firstParent: commentDto.firstParent,
      onPostId: postId,
      likeCount: 0,
      replyCount: 0,
      requesterLiked: false,
      createdAt: commentDto.createdAt,
      updatedAt: commentDto.updatedAt,
    });
  },
);

// GET /posts/:postId/comments
router.get<
  IGetComments['params'],
  IGetComments['res'],
  IGetComments['body'],
  IGetComments['query']
>(
  '/posts/:postId/comments',
  auth('any'),
  validate(RouteSchemas.getComments),
  async (req, res) => {
    const postId = req.params.postId;

    const page = req.query.page ? Number.parseInt(req.query.page) : 0;

    const limit = req.query.perPage ? Number.parseInt(req.query.perPage) : 5;
    const skip = limit * page;

    const [comments, totalCount] = await CommentRepository.findOnPost(
      postId,
      req.user?.id,
      skip,
      limit,
    );

    const commentsDto = instanceToPlain(comments) as CommentDto[];

    res.send({
      ...getPaginationMetaData(page, limit, totalCount),
      comments: commentsDto,
    });
  },
);

// GET /posts/:postId/comments/:commentId/replies
router.get<
  IGetCommentReplies['params'],
  IGetCommentReplies['res'],
  IGetCommentReplies['body'],
  IGetCommentReplies['query']
>(
  '/posts/:postId/comments/:commentId/replies',
  validate(RouteSchemas.getCommentReplies),
  async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const page = req.query.page ? Number.parseInt(req.query.page) : 0;

    const limit = req.query.perPage ? Number.parseInt(req.query.perPage) : 5;
    const skip = limit * page;

    const [replies, totalCount] = await CommentRepository.findRepliesOnPost(
      postId,
      commentId,
      req.user?.id,
      skip,
      limit,
    );

    const commentsDto = instanceToPlain(replies) as CommentDto[];

    res.send({
      ...getPaginationMetaData(page, limit, totalCount),
      replies: commentsDto,
    });
  },
);

// DELETE /comments/:id
router.delete<
  IDeleteComment['params'],
  IDeleteComment['res'],
  IDeleteComment['body'],
  IDeleteComment['query']
>(
  '/comments/:commentId',
  validate(RouteSchemas.deleteComment),
  async (req, res) => {
    const commentId = req.params.commentId;

    const del = await CommentRepository.delete({ id: commentId });

    if (!del.affected) {
      throw new ApiError(404, 'Comment to delete not found');
    }

    res.status(204).send();
  },
);

export default router;
