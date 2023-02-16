import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApi } from '@src/hooks/useApi';
import { notificationApi } from '@src/api/notifications';

const NIBLET_HAS_TOKEN_KEY = '@niblet_hasToken';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const registerNotificationApi = useApi(notificationApi.register);

  const registerToken = async (token: string) =>
    await registerNotificationApi.request({ body: { token } });

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        if ((await AsyncStorage.getItem(NIBLET_HAS_TOKEN_KEY)) === 'true')
          return;

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        try {
          await AsyncStorage.setItem(NIBLET_HAS_TOKEN_KEY, 'true');
          await registerToken(token);
        } catch (error) {
          console.error(`Error saving token: ${error}`);
        }
      } else {
        // alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      const notificationListener =
        Notifications.addNotificationReceivedListener((event) =>
          console.log(JSON.stringify(event)),
        );

      // Rarely, push tokens are changed by the service while the app is
      // running. This listener registers any new tokens created.
      const tokenListener = Notifications.addPushTokenListener((token) =>
        registerToken(token.data),
      );

      // On unmount, remove listeners
      return () => {
        tokenListener.remove();
        notificationListener.remove();
      };
    };

    const getPermissionsAsync = async () => {
      const { granted } = await Notifications.getPermissionsAsync();
      setHasPermission(granted);
    };

    registerForPushNotificationsAsync();
    getPermissionsAsync();
  }, []);

  return {
    hasPermission,
  };
};
