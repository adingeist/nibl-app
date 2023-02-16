import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import merge from 'deepmerge';

import { AuthContext, authStorage } from '@src/auth';
import { CameraProvider } from '@src/context/CameraContext';
import { darkTheme, lightTheme } from '@src/theme/theme';
import { RootAppStackNavigator } from '@src/screens/RootAppStackNavigator';
import { useAuthReducer } from '@src/auth/AuthContext';
import AuthNavigator from '@src/screens/auth/AuthNavigator';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const CombinedDefaultTheme = merge(NavigationDefaultTheme, lightTheme);
const CombinedDarkTheme = merge(NavigationDarkTheme, darkTheme);

export default function App() {
  const colorScheme = useColorScheme();
  const [authState, authDispatch] = useAuthReducer();
  const [isReady, setIsReady] = useState(false);

  const { user, isWelcomingUser } = authState;

  const theme = useMemo(
    () => (colorScheme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme),
    [colorScheme],
  );

  useEffect(() => {
    const prepareApp = async () => {
      const storedUser = await authStorage.getUser();
      if (!user && storedUser) {
        authDispatch({ type: 'LOGIN_EXISTING_USER', user: storedUser });
      }

      const userNeedsToLogin = !storedUser && !user;
      const userLoadedFromStorage = storedUser && user;
      if (userLoadedFromStorage || userNeedsToLogin) {
        setIsReady(true);
      }
    };

    prepareApp();
  }, [authDispatch, user]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  const ActiveNavigator = useMemo(() => {
    if (user && !isWelcomingUser) {
      return RootAppStackNavigator;
    } else {
      return AuthNavigator;
    }
  }, [isWelcomingUser, user]);

  if (!isReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={styles.app}>
      <PaperProvider theme={theme}>
        <AuthContext.Provider value={{ ...authState, dispatch: authDispatch }}>
          <CameraProvider>
            <NavigationContainer theme={theme}>
              <ActiveNavigator />
            </NavigationContainer>
          </CameraProvider>
        </AuthContext.Provider>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
});
