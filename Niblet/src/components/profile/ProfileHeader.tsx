import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';

import { AppAvatar } from '@src/components/AppAvatar';
import { IGetUserProfile } from '@shared/types/routes/users.controller';
import { LinkText } from '@src/components/LinkText';
import { StatButton } from '@src/components/profile/StatButtons';
import { TabBarProps } from 'react-native-collapsible-tab-view';
import { useTheme } from '@src/hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { MainAppNavigationProp } from '@src/types/navigation';

interface ProfileHeaderProps extends TabBarProps {
  username: string;
  user?: IGetUserProfile['res'];
}

export const ProfileHeader = ({ user, username }: ProfileHeaderProps) => {
  const theme = useTheme();
  const navigation = useNavigation<MainAppNavigationProp>();

  const navigateToFollowers = useCallback(() => {
    if (user) {
      navigation.navigate('Followers', { userId: user.id });
    }
  }, [navigation, user]);

  const openProfileLink = useCallback(() => {
    if (user?.link) {
      WebBrowser.openBrowserAsync(user.link);
    }
  }, [user]);

  return (
    <View style={[{ paddingHorizontal: theme.screenMargin }, styles.container]}>
      <AppAvatar size={85} uri={user?.profileImage} />

      <View style={styles.statsButtons}>
        <StatButton label="Recipes" number={user?.recipeCount} />
        <StatButton label="Nibs" number={user?.nibCount} />
        <StatButton
          onPress={navigateToFollowers}
          label="Followers"
          number={user?.followersCount}
        />
        <StatButton label="Likes" number={user?.likesCount} />
      </View>

      <View>
        <Text
          variant="bodyMedium"
          style={[styles.username, { marginBottom: user?.bio ? 6 : 0 }]}
        >
          @{username}
        </Text>
      </View>
      {user?.bio && (
        <Text variant="bodySmall" style={styles.bio}>
          {user.bio || ''}
        </Text>
      )}
      {user?.link && (
        <LinkText
          style={styles.link}
          onPress={openProfileLink}
          variant="bodySmall"
        >
          {user.link || ''}
        </LinkText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bio: { textAlign: 'center', marginBottom: 6 },

  container: { alignItems: 'center' },

  statsButtons: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  username: { fontWeight: '500', marginTop: 12 },

  link: {
    marginTop: 5,
  },
});
