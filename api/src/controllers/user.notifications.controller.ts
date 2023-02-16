import { ApiError } from '@src/utils/ApiError';
import { auth } from '@src/middleware/auth';
import { ExpoPushToken } from '@src/entities/ExpoPushToken.entity';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { RouteSchemas } from '@shared/schemas/routes';
import { UserRepository } from '@src/repository/User.repository';
import { validate } from '@src/middleware/validate';
import express from 'express';
import {
  IGetNotificationSettings,
  IPostExpoPushToken,
  IUpdateNotificationSettings,
} from '@shared/schemas/routes/user.notifications.controller.yup';
import { ExpoPushTokenRepository } from '@src/repository/ExpoPushToken.repository';
import { UserNotificationSettingsRepository } from '@src/repository/UserNotificationSettingsRepository';

const router = express.Router({});

// POST /user/notifications/expo-push-token
router.post<
  IPostExpoPushToken['params'],
  IPostExpoPushToken['res'],
  IPostExpoPushToken['body'],
  IPostExpoPushToken['query']
>(
  '/expo-push-token',
  auth('user'),
  validate(RouteSchemas.postExpoPushToken),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;
    const token = req.body.token;

    const user = await UserRepository.findOne({
      where: { id: userRequesting.id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const taken = await ExpoPushTokenRepository.findOneBy({
      token,
    });

    if (taken) {
      throw new ApiError(
        304,
        'Not modified: this expo token is already linked with this user',
      );
    }

    const pushToken = new ExpoPushToken();
    pushToken.user = user;
    pushToken.token = token;

    await ExpoPushTokenRepository.save(pushToken);

    res.status(201).send();
  },
);

// GET /user/notifications
router.get<
  IGetNotificationSettings['params'],
  IGetNotificationSettings['res'],
  IGetNotificationSettings['body'],
  IGetNotificationSettings['query']
>('/', auth('user'), async (req, res) => {
  const userRequesting = req.user as JWTUserPayload;

  const settings = await UserNotificationSettingsRepository.findOneBy({
    user: { id: userRequesting.id },
  });

  if (!settings) {
    throw new ApiError(404, 'Settings for user not found');
  }

  res.send(settings);
});

// PUT /user/notifications
router.put<
  IUpdateNotificationSettings['params'],
  IUpdateNotificationSettings['res'],
  IUpdateNotificationSettings['body'],
  IUpdateNotificationSettings['query']
>(
  `/`,
  auth('user'),
  validate(RouteSchemas.updateNotificationSettings),
  async (req, res) => {
    const userRequesting = req.user as JWTUserPayload;

    const settings = await UserNotificationSettingsRepository.findOneBy({
      user: { id: userRequesting.id },
    });

    if (!settings) {
      throw new ApiError(404, 'Settings for user not found');
    }

    const newSettings = { ...settings, ...req.body };

    await UserNotificationSettingsRepository.save(newSettings);

    res.send({
      notifyCommentOnPost: newSettings.notifyCommentOnPost,
      notifyCommentReply: newSettings.notifyCommentReply,
      notifyPostLikes: newSettings.notifyPostLikes,
      notifyRecipeGetsNib: newSettings.notifyRecipeGetsNib,
    });
  },
);

export default router;
