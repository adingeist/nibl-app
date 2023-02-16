import React, { useCallback, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  MainAppStackNavigatorParamList,
  TabNavigatorParamList,
} from '@src/types/navigation';

import { EditEmailScreen } from '@src/screens/EditEmailScreen';
import { EditPhoneScreen } from '@src/screens/profile/EditPhoneScreen';
import { EditProfileScreen } from '@src/screens/profile/EditProfileScreen';
import { EditSecurityScreen } from '@src/screens/profile/EditSecurityScreen';
import { FeedScreen } from '@src/screens/FeedScreen';
import { InboxScreen } from '@src/screens/InboxScreen';
import { ProfileScreen } from '@src/screens/profile/ProfileScreen';
import { useDefaultHeaders } from '@src/theme/headers';
import { useNotifications } from '@src/hooks/useNotifications';
import { UserSettingsScreen } from '@src/screens/profile/UserSettingsScreen';
import NotFoundScreen from '@src/screens/NotFoundScreen';
import { RecipeDetailsScreen } from '@src/screens/RecipeDetailsScreen';
import { FoodDetailsScreen } from '@src/screens/FoodDetailsScreen';
import { CommentsModal } from '@src/components/comments/CommentsModal';
import { FollowersScreen } from '@src/screens/profile/FollowersScreen';
import { DeviceEventEmitter } from 'react-native';
import { NotificationsPermissionScreen } from '@src/screens/profile/NotificationsPermissionScreen';
import { CalendarScreen } from '@src/screens/CalendarScreen';

const Stack = createStackNavigator<MainAppStackNavigatorParamList>();

export const MainAppNavigator = ({
  navigation,
  route: TabRoute,
}: BottomTabScreenProps<TabNavigatorParamList>) => {
  useNotifications();
  const headers = useDefaultHeaders();

  // Detect when a tab is pressed and make it accessible globally
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (e.target?.startsWith('ProfileTab')) {
        DeviceEventEmitter.emit('profileTabDoublePress', e);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const getInitialRouteName =
    useCallback((): keyof MainAppStackNavigatorParamList => {
      switch (TabRoute.name) {
        case 'FeedTab':
          return 'Feed';
        case 'CalendarTab':
          return 'Calendar';
        case 'ProfileTab':
          return 'Profile';
        case 'InboxTab':
          return 'Inbox';
        default:
          return 'NotFound';
      }
    }, [TabRoute.name]);

  return (
    <Stack.Navigator
      screenOptions={headers.stackHeaderOptions}
      initialRouteName={getInitialRouteName()}
    >
      <Stack.Screen
        name="Feed"
        options={{ headerShown: false }}
        component={FeedScreen}
      />
      <Stack.Screen
        name="Recipe"
        options={{ title: 'Recipe' }}
        component={RecipeDetailsScreen}
      />
      <Stack.Screen
        name="Nib"
        options={{ title: 'Nib' }}
        component={NotFoundScreen}
      />

      <Stack.Screen
        name="Inbox"
        options={{ title: 'Inbox' }}
        component={InboxScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserSettings"
        options={{ title: 'Settings' }}
        component={UserSettingsScreen}
      />
      <Stack.Screen
        name="EditSecurity"
        options={{ title: 'Security' }}
        component={EditSecurityScreen}
      />
      <Stack.Screen
        name="EditProfile"
        options={{ title: 'Edit Profile' }}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="EditEmail"
        options={{ title: 'Email' }}
        component={EditEmailScreen}
      />
      <Stack.Screen
        name="EditPhone"
        options={{ title: 'Phone' }}
        component={EditPhoneScreen}
      />

      <Stack.Screen
        name="EditNotifications"
        options={{ title: 'Notifications' }}
        component={NotificationsPermissionScreen}
      />
      <Stack.Screen
        name="NotFound"
        options={{ title: 'Not Found' }}
        component={NotFoundScreen}
      />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />

      <Stack.Screen
        options={{ presentation: 'transparentModal', headerShown: false }}
        name="CommentsModal"
        component={CommentsModal}
      />

      <Stack.Screen name="Calendar" component={CalendarScreen} />

      <Stack.Screen name="Followers" component={FollowersScreen} />
    </Stack.Navigator>
  );
};
