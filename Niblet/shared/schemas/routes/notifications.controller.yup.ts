import { NotificationResponse } from '@shared/types/responses/Notification';
import { yupPaginationQuery } from '@shared/schemas/pagination.yup';
import { PaginationQuery, PaginationRes } from '@shared/types/dto/Pagination';
import * as Yup from 'yup';

export type IGetNotifications = {
  params: Record<string, never>;
  body: Record<string, never>;
  query: PaginationQuery;
  res: {
    notifications: NotificationResponse[];
  } & PaginationRes;
};

export const notificationsRouteSchemas = {
  getNotifications: {
    query: Yup.object().shape(yupPaginationQuery),
  },
};
