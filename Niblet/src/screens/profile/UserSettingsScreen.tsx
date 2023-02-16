import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { MainAppScreenProps } from '@src/types/navigation';
import { Screen } from '@src/components/Screen';
import { useAuthContext } from '@src/auth';
import ListRowButton from '@src/components/ListRowButton';
import { useApi } from '@src/hooks/useApi';
import { authApi } from '@src/api/auth';
import { LoadingOverlay } from '@src/components/LoadingOverlay';

export const UserSettingsScreen = ({
  navigation,
}: MainAppScreenProps<'UserSettings'>) => {
  const theme = useTheme();
  const auth = useAuthContext();

  const logoutApi = useApi(authApi.logout);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      // Remove push token from non-emulator devices
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync();
        await logoutApi.request({ body: { pushToken: token.data } });
      }

      await auth.logOut();
      // eslint-disable-next-line no-empty
    } catch (err) {
    } finally {
      setIsLogoutLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={isLogoutLoading} />
      <Screen>
        <ScrollView style={styles.scrollViewContainer}>
          <ListRowButton
            iconName="account-outline"
            text="Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <ListRowButton
            iconName="bell-outline"
            text="Notifications"
            onPress={() => navigation.navigate('EditNotifications')}
          />
          <ListRowButton
            iconName="shield-outline"
            text="Security"
            onPress={() => navigation.navigate('EditSecurity')}
          />
          <ListRowButton
            iconName="email-outline"
            text="Email"
            onPress={() => navigation.navigate('EditEmail')}
          />
          <ListRowButton
            iconName="phone-outline"
            text="Phone"
            onPress={() => navigation.navigate('EditPhone')}
          />
          <ListRowButton
            iconName="exit-to-app"
            text="Logout"
            textColor={theme.colors.error}
            onPress={handleLogout}
          />
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  name: { fontWeight: 'bold' },
  profileHeader: { flexDirection: 'row', marginVertical: 10 },
  avatar: { marginHorizontal: 20 },
  scrollViewContainer: { height: '100%' },
});
