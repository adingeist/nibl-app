import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { TabNavigator } from '@src/screens/TabNavigator';
import { UploadNavigator } from '@src/screens/upload/UploadNavigator';
import { RootAppStackParamList } from '@src/types/navigation';
import React from 'react';

const Stack = createStackNavigator<RootAppStackParamList>();

export const RootAppStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'red' },
        presentation: 'modal',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
      initialRouteName="MainTabNavigator"
    >
      <Stack.Screen name="MainTabNavigator" component={TabNavigator} />
      <Stack.Screen name="UploadNavigator" component={UploadNavigator} />
    </Stack.Navigator>
  );
};
