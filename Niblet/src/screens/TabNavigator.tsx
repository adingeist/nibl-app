import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@src/hooks/useTheme';
import { MainAppNavigator } from '@src/screens/MainAppNavigator';
import {
  RootAppStackParamList,
  TabNavigatorParamList,
} from '@src/types/navigation';
import { UploadNavigator } from '@src/screens/upload/UploadNavigator';
import { StackScreenProps } from '@react-navigation/stack';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export const TabNavigator = ({
  navigation,
}: StackScreenProps<RootAppStackParamList, 'MainTabNavigator'>) => {
  const { colors } = useTheme();

  return (
    <View
      style={
        [styles.navigatorBackground, { backgroundColor: colors.background }]
        /*Prevents white flashing while navigating*/
      }
    >
      <Tab.Navigator
        initialRouteName="FeedTab"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: React.ComponentProps<
              typeof MaterialCommunityIcons
            >['name'] = 'file-question';

            if (route.name === 'FeedTab') iconName = 'home';
            else if (route.name === 'InboxTab') iconName = 'heart';
            else if (route.name === 'PostTab') iconName = 'post';
            else if (route.name === 'CalendarTab') iconName = 'calendar';
            else if (route.name === 'ProfileTab') iconName = 'face-man-profile';

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.dark,
          tabBarStyle: {
            height: 76,
            backgroundColor:
              route.name === 'FeedTab' ? '#000' : colors.background,
          },

          headerShown: false,
        })}
      >
        <Tab.Screen
          name="FeedTab"
          options={{ title: 'Feed' }}
          component={MainAppNavigator}
        />

        <Tab.Screen
          name="CalendarTab"
          options={{ title: 'Calendar' }}
          component={MainAppNavigator}
        />
        <Tab.Screen
          name="PostTab"
          options={{
            title: 'Post',
            tabBarButton: (props) => {
              return (
                <TouchableOpacity
                  {...props}
                  onPress={() =>
                    navigation.navigate('UploadNavigator', {
                      screen: 'VideoEditor',
                      params: { navigateNextTo: 'CreateRecipe' },
                    })
                  }
                />
              );
            },
          }}
          component={UploadNavigator}
        />
        <Tab.Screen
          name="InboxTab"
          options={{ title: 'Inbox' }}
          component={MainAppNavigator}
        />
        <Tab.Screen
          name="ProfileTab"
          options={{ title: 'Profile' }}
          component={MainAppNavigator}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  navigatorBackground: {
    borderBottomWidth: 0,
    flex: 1,
  },
});
