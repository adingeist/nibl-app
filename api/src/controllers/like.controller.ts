import { auth } from '@src/middleware/auth';
import { PostLikeRepository } from '@src/repository/PostLike.repository';
import { UserRepository } from '@src/repository/User.repository';
import {
  ILikeComment,
  ILikePost,
  IUnlikeComment,
  IUnlikePost,
} from '@shared/types/routes/like.controller';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { ApiError } from '@src/utils/ApiError';
import express from 'express';
import { instanceToPlain } from 'class-transformer';
import { PostLikeDto } from '@shared/types/dto/PostLikeDto.entity';
import { CommentLikeRepository } from '@src/repository/CommentLike.repository';
import { CommentRepository } from '@src/repository/Comment.repository';
import { CommentLikeDto } from '@shared/types/dto/CommentLikeDto.entity';
import { RecipeRepository } from '@src/repository/Recipe.repository';
import { NotificationsService } from '@src/services/Notifications.service';
import { PostRepository } from '@src/repository/Post.repository';
import { NibRepository } from '@src/repository/Nib.repository';
import { validate } from '@src/middleware/validate';
import { RouteSchemas } from '@shared/schemas/routes';

const router = express.Router();

// POST /posts/:id/like
router.post<
  ILikePost['params'],
  ILikePost['res'],
  ILikePost['body'],
  ILikePost['query']
>(
  '/posts/:id/like',
  auth('user'),
  validate(RouteSchemas.likePost),
  async (req, res) => {
    const postId = req.params.id;

    const post = await PostRepository.findOne({
      where: { id: postId },
      relations: { postedBy: true },
    });

    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    const userRequesting = await UserRepository.findUserRequestingOrThrow404(
      req,
    );

    const alreadyLiked = await PostLikeRepository.findOneBy({
      postLiked: { id: post.id },
      likedBy: { id: userRequesting.id },
    });

    if (alreadyLiked) {
      throw new ApiError(400, 'Post already liked by user');
    }

    let like = PostLikeRepository.create({
      postLiked: post,
      likedBy: userRequesting,
    });

    like = await PostLikeRepository.save(like);

    const postLikeDto = instanceToPlain(like) as PostLikeDto;

    // Do not await the request while sending the notification, just respond 201
    new Promise((res) => {
      RecipeRepository.findOneBy({ post: { id: postId } }).then((recipe) => {
        if (recipe) {
          NotificationsService.sendRecipeLikedPushNotification(
            post.postedBy.id,
            userRequesting,
            recipe,
          );
        }
        NibRepository.findOneBy({ post: { id: postId } }).then((nib) => {
          if (nib) {
            NotificationsService.sendNibLikedPushNotification(
              post.postedBy.id,
              userRequesting,
              nib,
            );
          }
          res('notification sent');
        });
      });
    });

    res.status(201).send(postLikeDto);
  },
);

// DELETE /posts/:id/unlike
router.delete<
  IUnlikePost['params'],
  IUnlikePost['res'],
  IUnlikePost['body'],
  IUnlikePost['query']
>(
  '/posts/:id/unlike',
  auth('user'),
  validate(RouteSchemas.unlikePost),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;
    const postId = req.params.id;

    const deleted = await PostLikeRepository.delete({
      postLiked: { id: postId },
      likedBy: { id: userRequesting.id },
    });

    if (deleted.affected) {
      return res.status(204).send();
    }

    throw new ApiError(404, 'Like to delete not found');
  },
);

// POST /comments/:id/like
router.post<
  ILikeComment['params'],
  ILikeComment['res'],
  ILikeComment['body'],
  ILikeComment['query']
>('/comments/:id/like', auth('user'), async (req, res) => {
  const commentId = req.params.id;

  const comment = await CommentRepository.findOneBy({ id: commentId });

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const userRequesting = await UserRepository.findUserRequestingOrThrow404(req);

  let like = CommentLikeRepository.create({
    commentLiked: comment,
    likedBy: userRequesting,
  });

  like = await CommentLikeRepository.save(like);

  const commentLikeDto = instanceToPlain(like) as CommentLikeDto;

  res.status(201).send(commentLikeDto);
});

// DELETE /comments/:id/unlike
router.delete<
  IUnlikeComment['params'],
  IUnlikeComment['res'],
  IUnlikeComment['body'],
  IUnlikeComment['query']
>('/comments/:id/unlike', auth('user'), async (req, res) => {
  const userRequesting = req.user as JWTUserPayload;
  const commentId = req.params.id;

  const deleted = await CommentLikeRepository.delete({
    commentLiked: { id: commentId },
    likedBy: { id: userRequesting.id },
  });

  if (deleted.affected) {
    return res.status(204).send();
  }

  throw new ApiError(404, 'Like to delete not found');
});

export default router;
