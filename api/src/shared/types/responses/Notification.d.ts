type NotificationTypes =
  | 'COMMENT_ON_NIB'
  | 'COMMENT_ON_RECIPE'
  | 'NEW_FOLLOWER'
  | 'NIB_LIKED'
  | 'NIB_ON_RECIPE'
  | 'RECIPE_LIKED';

/**
 * Related data fetched in GET notification requests
 */
interface UserNotificationData {
  id: string;
  username: string;
  profileImageKey?: string;
}

interface PostNotificationData {
  postedBy: UserNotificationData;
  thumbnailKey: string;
}

interface RecipeNotificationData {
  id: string;
  post: PostNotificationData;
}

interface CommentNotificationData {
  id: string;
  body: string;
}

interface NibNotificationData {
  id: string;
  post: PostNotificationData;
}

/**
 * Common required properties among along all notification types
 */
interface BaseNotification {
  id: string;
  userNotified: string; // uuid
  type: NotificationTypes;
}

/**
 * Different types of notifications
 */
interface CommentOnNibNotification extends BaseNotification {
  type: 'COMMENT_ON_NIB';
  triggeredByUser: UserNotificationData;
  comment: CommentNotificationData;
  nib: NibNotificationData;
}

interface CommentOnRecipeNotification extends BaseNotification {
  type: 'COMMENT_ON_RECIPE';
  triggeredByUser: UserNotificationData;
  comment: CommentNotificationData;
  recipe: RecipeNotificationData;
}

interface NewFollowerNotification extends BaseNotification {
  type: 'NEW_FOLLOWER';
  triggeredByUser: UserNotificationData;
}

interface NibLikedNotification extends BaseNotification {
  type: 'NIB_LIKED';
  triggeredByUser: UserNotificationData;
  nib: NibNotificationData;
}

interface NibOnRecipeNotification extends BaseNotification {
  type: 'NIB_ON_RECIPE';
  triggeredByUser: UserNotificationData;
  nib: NibNotificationData;
}

interface RecipeLikedNotification extends BaseNotification {
  type: 'RECIPE_LIKED';
  triggeredByUser: UserNotificationData;
  recipe: RecipeNotificationData;
}

/**
 * Intelligent NotificationResponse type that will provide the notification's
 * types when notification.type === 'TYPE' is performed
 */
export type NotificationResponse =
  | CommentOnNibNotification
  | CommentOnRecipeNotification
  | NewFollowerNotification
  | NibLikedNotification
  | NibOnRecipeNotification
  | RecipeLikedNotification;
