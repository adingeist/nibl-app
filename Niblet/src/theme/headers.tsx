import React from 'react';
import {
  BackButton,
  DisableAndroidBack,
  LogoTitle,
} from '@src/components/navigation';
import { StackNavigationOptions } from '@react-navigation/stack';
import { useTheme } from '@src/hooks/useTheme';

export const useDefaultHeaders = () => {
  const theme = useTheme();

  return {
    stackHeaderOptions: {
      headerStyle: { shadowColor: 'transparent' },
      headerLeftContainerStyle: { paddingLeft: theme.screenMargin },
      headerRightContainerStyle: { paddingRight: theme.screenMargin },
      headerBackTitleVisible: false,
      gestureEnabled: true,
    },

    back_logo_null: {
      headerBackImage: () => <BackButton />,
      headerTitle: () => <LogoTitle />,
      headerBackTitleVisible: false,
      headerStyle: { shadowColor: 'transparent' },
    } as StackNavigationOptions,

    noBack_logo_null: {
      headerBackImage: () => <DisableAndroidBack />,
      headerTitle: () => <LogoTitle />,
      headerBackTitleVisible: false,
      headerStyle: { shadowColor: 'transparent' },
      gestureEnabled: false,
    } as StackNavigationOptions,
  };
};
