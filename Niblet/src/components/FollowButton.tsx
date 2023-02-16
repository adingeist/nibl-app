import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ToggleButton } from '@src/components/ToggleButton';
import { useTheme } from '@src/hooks/useTheme';
import { useApi } from '@src/hooks/useApi';
import { followersApi } from '@src/api/followers';

type FollowButtonProps = {
  userId: string;
  isFollowing: boolean;
};

const FollowButton = ({ isFollowing, userId }: FollowButtonProps) => {
  const theme = useTheme();
  const followApi = useApi(followersApi.followUser);
  const unfollowApi = useApi(followersApi.unfollowUser);

  const handlePress = useCallback(async () => {
    if (followApi.isLoading || unfollowApi.isLoading) {
      return;
    }

    if (isFollowing) {
      await unfollowApi.request({ params: { id: userId } });
    } else {
      await followApi.request({ params: { id: userId } });
    }
  }, [followApi, isFollowing, unfollowApi, userId]);

  return (
    <ToggleButton
      onPress={handlePress}
      style={styles.container}
      isToggled={isFollowing}
      toggledLabel="Following"
      toggledLabelStyle={{ color: theme.colors.background }}
      toggledStyle={{ backgroundColor: theme.colors.primary }}
      notToggledLabel="Follow"
      notToggledLabelStyle={{ color: theme.colors.background }}
      notToggledStyle={{ backgroundColor: theme.colors.secondary }}
    />
  );
};

export default FollowButton;

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
});
