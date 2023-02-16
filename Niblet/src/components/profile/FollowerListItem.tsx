import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '@src/hooks/useTheme';
import { AppAvatar } from '@src/components/AppAvatar';
import FollowButton from '@src/components/FollowButton';
import { PostedByDtoType } from '@shared/types/dto/PostedByDto';

type FollowerListItemProps = {
  user: PostedByDtoType;
};

const FollowerListItemComponent = ({ user }: FollowerListItemProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: theme.screenMargin }]}>
      <AppAvatar uri={user.profileImage} size={30} style={styles.avatar} />
      <Text>{user.username}</Text>
      <FollowButton userId={user.id} isFollowing={user.requesterIsFollowing} />
    </View>
  );
};

export const FollowerListItem = React.memo(FollowerListItemComponent);

const styles = StyleSheet.create({
  avatar: {
    marginRight: 14,
  },

  container: {
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
