import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ForgotPasswordStartScreen } from '@src/screens/auth/ForgotPasswordStartScreen';
import { LoginScreen } from '@src/screens/auth/LoginScreen';
import { ResetPassword } from '@src/screens/auth/ResetPassword';
import { SignUpScreen } from '@src/screens/auth/SignUpScreen';
import { AuthFlowSubmitOTPScreen } from '@src/screens/auth/AuthFlowSubmitOTPScreen';
import { Welcome } from '@src/screens/auth/Welcome';
import { useTheme } from '@src/hooks/useTheme';
import { useDefaultHeaders } from '@src/theme/headers';
import { NotificationsPermissionScreen } from '@src/screens/profile/NotificationsPermissionScreen';

export type AuthNavParams = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  NotificationPermission: undefined;
  ProfileSetUp: { authToken: string };
  EnterOTP: {
    userId: string;
    nextScreen: 'ResetPassword' | 'NotificationPermission';
    email?: string;
    phone?: string;
  };
  ForgotPasswordStart: undefined;
  ResetPassword: { authToken: string };
};

const Stack = createStackNavigator<AuthNavParams>();

export default function AuthNavigator(): JSX.Element {
  const headers = useDefaultHeaders();
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { shadowColor: 'transparent' },
        headerLeftContainerStyle: { paddingLeft: theme.screenMargin },
        headerRightContainerStyle: { paddingRight: theme.screenMargin },
        gestureEnabled: true,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordStart"
        component={ForgotPasswordStartScreen}
        options={headers.back_logo_null}
      />
      <Stack.Screen
        name="EnterOTP"
        component={AuthFlowSubmitOTPScreen}
        options={headers.back_logo_null}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={headers.noBack_logo_null}
      />
      <Stack.Screen
        name="NotificationPermission"
        component={NotificationsPermissionScreen}
        options={headers.noBack_logo_null}
      />
    </Stack.Navigator>
  );
}
