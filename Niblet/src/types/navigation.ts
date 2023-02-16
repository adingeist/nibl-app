import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

export type RecipeBeingNibbed = {
  id: string;
  title: string;
  post: {
    postedBy: { username: string; profileImage?: string };
    thumbnail: string;
  };
};

/**
- RootAppStackNavigator 
  - UploadNavigator
    -  
  - TabNavigator
    - MainAppStackNavigator : "Feed"
    - MainAppStackNavigator : "Search"
    - MainAppStackNavigator : "Calendar"
    - MainAppStackNavigator : "Profile"
 */

export type UploadNavigatorParamList = {
  VideoEditor:
    | { navigateNextTo: 'CreateRecipe' }
    | {
        navigateNextTo: 'CreateNib';
        recipe: RecipeBeingNibbed;
      };
  CreateRecipe: { clipUris: string[] };
  CreateNib: {
    clipUris: string[];
    recipe: RecipeBeingNibbed;
  };
  CreateIngredient: undefined;
};

export type UploadNavigationProp =
  StackNavigationProp<UploadNavigatorParamList>;

export type UploadScreenProp<T extends keyof UploadNavigatorParamList> =
  StackScreenProps<UploadNavigatorParamList, T>;

export type RootAppStackParamList = {
  MainTabNavigator: NavigatorScreenParams<MainAppStackNavigatorParamList>;
  UploadNavigator: NavigatorScreenParams<UploadNavigatorParamList>;
};

export type TabNavigatorParamList = {
  FeedTab: undefined;
  InboxTab: undefined;
  PostTab: undefined;
  CalendarTab: undefined;
  ProfileTab: undefined;
};

export type MainAppStackNavigatorParamList = {
  Feed: undefined;
  Recipe: { id: string };
  Nib: { id: string };
  Inbox: undefined;
  Profile: { username?: string };
  Followers: { userId: string };
  UserSettings: undefined;
  NotFound: undefined;
  EditProfile: undefined;
  EditSecurity: undefined;
  EditEmail: undefined;
  EditPhone: undefined;
  EditNotifications: undefined;
  FoodDetails: { foodId: string; foodName?: string; brandName?: string };
  CommentsModal: { postId: string };
  Calendar: undefined;
};

// RootAppStackNavigator + UploadNavigator
export type RootStackAndUploadScreenProps<
  T extends keyof UploadNavigatorParamList,
> = CompositeScreenProps<
  StackScreenProps<UploadNavigatorParamList, T>,
  StackScreenProps<RootAppStackParamList, 'UploadNavigator'>
>;

// RootAppStackNavigator + TabNavigator
export type RootStackAndTabScreenProps<T extends keyof RootAppStackParamList> =
  CompositeScreenProps<
    StackScreenProps<RootAppStackParamList, T>,
    BottomTabScreenProps<TabNavigatorParamList>
  >;

// (RootAppStackNavigator + TabNavigator) + MainAppStackNavigator
export type MainAppScreenProps<T extends keyof MainAppStackNavigatorParamList> =
  CompositeScreenProps<
    StackScreenProps<MainAppStackNavigatorParamList, T>,
    RootStackAndTabScreenProps<'MainTabNavigator'>
  >;

export type MainAppNavigationProp =
  StackNavigationProp<MainAppStackNavigatorParamList>;
