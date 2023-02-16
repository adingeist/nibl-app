import { errorHandler } from '@src/middleware/errorHandler';
import { httpLogger } from '@src/middleware/httpLogger';
import { jsonErrorHandler } from '@src/middleware/jsonErrorHandler';
import { notFoundHandler } from '@src/middleware/notFoundHandler';
import { rateLimiter } from '@src/middleware/rateLimiter';
import { Application, json, Router } from 'express';
import auth from '@src/controllers/auth.controller';
import food from '@src/controllers/food.controller';
import userNotifications from '@src/controllers/user.notifications.controller';
import users from '@src/controllers/users.controller';
import recipes from '@src/controllers/recipes.controller';
import feed from '@src/controllers/feed.controller';
import like from '@src/controllers/like.controller';
import nibs from '@src/controllers/nibs.controller';
import comments from '@src/controllers/comments.controller';
import followers from '@src/controllers/followers.controller';
import posts from '@src/controllers/posts.controller';
import notifications from '@src/controllers/notifications.controller';

export const routePrefix = '/api/v1';

export const startPipeline = (app: Application) => {
  app.use(httpLogger);
  app.use(rateLimiter);
  app.use(json(), jsonErrorHandler);
  //
  app.use(`${routePrefix}/`, like);
  app.use(`${routePrefix}/auth`, auth);
  app.use(`${routePrefix}/users`, users as Router);
  app.use(`${routePrefix}/user/notifications`, userNotifications);
  app.use(`${routePrefix}/recipes`, recipes);
  app.use(`${routePrefix}/nibs`, nibs);
  app.use(`${routePrefix}/food`, food);
  app.use(`${routePrefix}/`, feed);
  app.use(`${routePrefix}/posts`, posts);
  app.use(`${routePrefix}/notifications`, notifications);
  app.use(`${routePrefix}`, comments);
  app.use(`${routePrefix}`, followers);
  //
  app.use(notFoundHandler);
  app.use(errorHandler);
};
