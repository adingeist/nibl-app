import { yupExpoPushToken } from '@shared/schemas/util.joi';
import * as Yup from 'yup';

type NotificationSettings = {
  notifyPostLikes: boolean;
  notifyCommentOnPost: boolean;
  notifyRecipeGetsNib: boolean;
  notifyCommentReply: boolean;
};

export type IPostExpoPushToken = {
  body: { token: string };
  query: Record<string, never>;
  params: Record<string, never>;
  res: Record<string, never>;
};

export type IGetNotificationSettings = {
  body: Record<string, never>;
  query: Record<string, never>;
  params: Record<string, never>;
  res: NotificationSettings;
};

export type IUpdateNotificationSettings = {
  body: NotificationSettings;
  query: Record<string, never>;
  params: Record<string, never>;
  res: NotificationSettings;
};

export const userNotificationRouteSchemas = {
  postExpoPushToken: {
    body: Yup.object().shape({ token: yupExpoPushToken.required() }),
  },

  updateNotificationSettings: {
    body: Yup.object().shape({
      notifyPostLikes: Yup.boolean(),
      notifyCommentOnPost: Yup.boolean(),
      notifyRecipeGetsNib: Yup.boolean(),
      notifyCommentReply: Yup.boolean(),
    }),
  },
};
