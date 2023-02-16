import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { NotificationResponse } from '@shared/types/responses/Notification';
import { AppAvatar } from '@src/components/AppAvatar';
import { LinkText } from '@src/components/LinkText';
import { MainAppScreenProps } from '@src/types/navigation';

type ListedNotificationProps = {
  notification: NotificationResponse;
  navigation: MainAppScreenProps<'Inbox'>['navigation'];
};

export const ListedNotification = ({
  notification,
  navigation,
}: ListedNotificationProps) => {
  type ContentType = {
    message: string;
    thumbnailKey?: string;
    onThumbnailPress?: () => void;
  };

  const goToProfile = useCallback(
    (username: string) => {
      navigation.navigate('Profile', { username });
    },
    [navigation]
  );

  const content: ContentType = useMemo(() => {
    switch (notification.type) {
      case 'COMMENT_ON_NIB':
        return {
          message: `Comment: ${notification.comment.body}`,
          thumbnailKey: notification.nib.post.thumbnailKey,
          onThumbnailPress: () =>
            navigation.navigate('Nib', { id: notification.nib.id }),
        };
      case 'COMMENT_ON_RECIPE':
        return {
          message: `Comment: ${notification.comment.body}`,
          thumbnailKey: notification.recipe.post.thumbnailKey,
          onThumbnailPress: () =>
            navigation.navigate('Recipe', { id: notification.recipe.id }),
        };

      case 'NEW_FOLLOWER':
        return {
          message: `started following you`,
        };

      case 'NIB_LIKED':
      case 'RECIPE_LIKED':
        return {
          message: `liked your post`,
          thumbnailKey:
            notification.type === 'NIB_LIKED'
              ? notification.nib.post.thumbnailKey
              : notification.recipe.post.thumbnailKey,
          onThumbnailPress: () => {
            if (notification.type === 'NIB_LIKED') {
              navigation.navigate('Nib', { id: notification.nib.id });
            } else {
              navigation.navigate('Recipe', { id: notification.recipe.id });
            }
          },
        };

      case 'NIB_ON_RECIPE':
        return {
          message: `nib'd your post`,
          thumbnailKey: notification.nib.post.thumbnailKey,
          onThumbnailPress: () =>
            navigation.navigate('Nib', { id: notification.nib.id }),
        };

      default:
        return {
          showProfileImage: false,
          message: '',
          triggerUsername: '',
        };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification.type]);

  return (
    <View style={styles.container}>
      <AppAvatar
        onPress={() => goToProfile(notification.triggeredByUser.username)}
        imageKey={notification.triggeredByUser.profileImageKey}
        size={46}
      />
      <View style={styles.textContainer}>
        <LinkText
          onPress={() => goToProfile(notification.triggeredByUser.username)}
          variant="bodyMedium"
        >
          {notification.triggeredByUser.username}
        </LinkText>
        <Text variant="bodyMedium">{content.message}</Text>
      </View>
      {content.thumbnailKey && (
        <Pressable onPress={content.onThumbnailPress}>
          <Image
            resizeMode="cover"
            source={{ uri: content.thumbnailKey }}
            style={styles.thumbnail}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 6,
  },

  thumbnail: {
    width: 50,
    height: 50,
  },
});
