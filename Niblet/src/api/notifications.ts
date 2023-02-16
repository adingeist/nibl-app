import { IGetNotifications } from '@shared/schemas/routes/notifications.controller.yup';
import {
  IGetNotificationSettings,
  IPostExpoPushToken,
  IUpdateNotificationSettings,
} from '@shared/schemas/routes/user.notifications.controller.yup';
import { client } from '@src/api/connection';
import { ApiFunction } from '@src/types/apisauce';

const register: ApiFunction<IPostExpoPushToken> = (req, config) => {
  return client.postWithAuthToken(
    `/api/v1/user/notifications/expo-push-token`,
    req.body,
    config,
  );
};

const updateSettings: ApiFunction<IUpdateNotificationSettings> = (
  req,
  config,
) => {
  return client.putWithAuthToken(
    `/api/v1/user/notifications`,
    req.body,
    config,
  );
};

const getSettings: ApiFunction<IGetNotificationSettings> = (req, config) => {
  return client.getWithAuthToken(`/api/v1/user/notifications`, {}, config);
};

const test = () => {
  return client.postWithAuthToken(`/api/v1/user/notifications/test`, {}, {});
};

const getNotifications: ApiFunction<IGetNotifications> = () => {
  return client.getWithAuthToken(`/api/v1/notifications`);
};

export const notificationApi = {
  getNotifications,
  register,
  updateSettings,
  getSettings,
  test,
};
