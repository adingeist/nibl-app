import { auth } from '@src/middleware/auth';
import { validate } from '@src/middleware/validate';
import { PostRepository } from '@src/repository/Post.repository';
import { yupObjectId } from '@shared/schemas/util.joi';
import { IDeletePost } from '@shared/types/routes/posts.controller';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { ApiError } from '@src/utils/ApiError';
import express from 'express';
import * as Yup from 'yup';

const router = express.Router();

router.delete<
  IDeletePost['params'],
  IDeletePost['res'],
  IDeletePost['body'],
  IDeletePost['query']
>(
  `/:id`,
  auth('user'),
  validate({ params: Yup.object().shape({ id: yupObjectId }) }),
  async (req, res) => {
    const postId = req.params.id;
    const userRequesting = req.user as JWTUserPayload;

    const post = await PostRepository.findOne({
      where: { id: postId },
      relations: { postedBy: true },
    });

    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    if (post.postedBy.id !== userRequesting.id) {
      throw new ApiError(403, `You don't have permission to delete this post`);
    }

    await PostRepository.delete({ id: postId });

    res.status(204).send();
  },
);

export default router;
