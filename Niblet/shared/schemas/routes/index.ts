import { authRouteSchemas } from '@shared/schemas/routes/auth.controller.yup';
import { calendarRouteSchemas } from '@shared/schemas/routes/calendars.controller.yup';
import { commentLikesRouteSchema } from '@shared/schemas/routes/comments.likes.controller.yup';
import { commentRouteSchemas } from '@shared/schemas/routes/comments.controller.yup';
import { commentsRepliesRouteSchemas } from '@shared/schemas/routes/comments.replies.controller.yup';
import { foodRouteSchemas } from '@shared/schemas/routes/food.controller.yup';
import { hashtagRouteSchemas } from '@shared/schemas/routes/hashtags.controller.yup';
import { postRouteSchemas } from '@shared/schemas/routes/posts.likes.controller.yup';
import { recipeRouteSchemas } from '@shared/schemas/routes/recipe.controller.yup';
import { userPwdForgotRouteSchemas } from '@shared/schemas/routes/users.pwd.forgot.controller.yup';
import { userRouteSchemas } from './users.controller.yup';
import { usersFollowersRouteSchemas } from '@shared/schemas/routes/users.followers.controller.yup';
import { userVerifyRouteSchemas } from '@shared/schemas/routes/users.verify.controller.yup';
import { userValidateRouteSchemas } from '@shared/schemas/routes/users.validate.controller.yup';
import { userNotificationRouteSchemas } from '@shared/schemas/routes/user.notifications.controller.yup';
import { notificationsRouteSchemas } from '@shared/schemas/routes/notifications.controller.yup';
import { nibsRouteSchemas } from '@shared/schemas/routes/nibs.controller.yup';
import { followerRouteSchemas } from '@shared/schemas/routes/follower.controller.yup';

export const RouteSchemas = {
  ...authRouteSchemas,
  ...calendarRouteSchemas,
  ...commentLikesRouteSchema,
  ...commentRouteSchemas,
  ...commentsRepliesRouteSchemas,
  ...foodRouteSchemas,
  ...hashtagRouteSchemas,
  ...postRouteSchemas,
  ...followerRouteSchemas,
  ...recipeRouteSchemas,
  ...userPwdForgotRouteSchemas,
  ...nibsRouteSchemas,
  ...userRouteSchemas,
  ...usersFollowersRouteSchemas,
  ...notificationsRouteSchemas,
  ...userValidateRouteSchemas,
  ...userNotificationRouteSchemas,
  ...userVerifyRouteSchemas,
};
