import { auth } from '@src/middleware/auth';
import { getPaginationMetaData } from '@src/utils/getPaginationMetaData';
import { IGetNotifications } from '@shared/schemas/routes/notifications.controller.yup';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { NotificationRepository } from '@src/repository/Notification.repository';
import { NotificationResponse } from '@shared/types/responses/Notification';
import { RouteSchemas } from '@shared/schemas/routes';
import { validate } from '@src/middleware/validate';
import express from 'express';

const router = express.Router();

// GET /notifications
router.get<
  IGetNotifications['params'],
  IGetNotifications['res'],
  IGetNotifications['body'],
  IGetNotifications['query']
>(
  `/`,
  auth('user'),
  validate(RouteSchemas.getNotifications),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;
    const page = req.query.page ? Number.parseInt(req.query.page) : 0;
    const take = req.query.perPage ? Number.parseInt(req.query.perPage) : 10;
    const skip = page * take;

    const userRelation = true;

    const postRelation = { postedBy: userRelation };

    const recipeRelation = { post: postRelation };

    const commentRelation = {
      onPost: postRelation,
      postedBy: userRelation,
    };

    const nibRelation = { post: postRelation };

    const [notifications, notificationCount] =
      await NotificationRepository.findAndCount({
        where: { userNotified: { id: userRequesting.id } },
        relations: {
          comment: commentRelation,
          nib: nibRelation,
          recipe: recipeRelation,
          triggeredByUser: userRelation,
          userNotified: userRelation,
        },
        order: { createdAt: 'DESC' },
        take,
        skip,
      });

    res.send({
      notifications: notifications as unknown as NotificationResponse[],
      ...getPaginationMetaData(page, take, notificationCount),
    });
  },
);

export default router;
