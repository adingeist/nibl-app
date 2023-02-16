import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ActionsColumn } from '@src/components/post/actions/ActionsColumn';
import { AppAvatar } from '@src/components/AppAvatar';
import { Caption } from '@src/components/post/Caption';
import { LinkText } from '@src/components/LinkText';
import { usePostContext } from '@src/components/post/PostContext';
import { useNavigation } from '@react-navigation/native';
import { MainAppNavigationProp } from '@src/types/navigation';
import { Title } from '@src/components/post/Title';
import { ToggleButton } from '@src/components/ToggleButton';
import { useTheme } from '@src/hooks/useTheme';
import { useApi } from '@src/hooks/useApi';
import { followersApi } from '@src/api/followers';
import { useAuthContext } from '@src/auth';

const ANIMATION_SPEED = 200; // ms

export const CardOverlay = () => {
  const { colors } = useTheme();
  const post = usePostContext();
  const [followingPoster, setFollowingPoster] = useState<boolean>(
    post.post.postedBy.requesterIsFollowing,
  );
  const { user } = useAuthContext();
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<MainAppNavigationProp>();
  const followApi = useApi(followersApi.followUser);
  const unfollowApi = useApi(followersApi.unfollowUser);

  const handleBackgroundPress = () => {
    setIsCaptionExpanded(false);
  };

  const handleOpenPostedByProfile = () => {
    navigation.navigate('Profile', { username: post.post.postedBy.username });
  };

  const dynamicStyles = StyleSheet.create({
    nameAndFollowContainer: { marginBottom: isCaptionExpanded ? 3 : 0 },
  });

  const followUser = useCallback(async () => {
    if (followApi.isLoading || unfollowApi.isLoading) return;

    setFollowingPoster((prev) => !prev);

    if (followingPoster) {
      await unfollowApi.request({ params: { id: post.post.postedBy.id } });
    } else {
      await followApi.request({ params: { id: post.post.postedBy.id } });
    }
  }, [followApi, followingPoster, post.post.postedBy.id, unfollowApi]);

  useEffect(() => {
    if (isCaptionExpanded) {
      Animated.timing(bgOpacity, {
        toValue: 0.7,
        useNativeDriver: false,
        duration: ANIMATION_SPEED,
      }).start();
    } else {
      Animated.timing(bgOpacity, {
        toValue: 0,
        useNativeDriver: false,
        duration: ANIMATION_SPEED,
      }).start();
    }
  }, [bgOpacity, isCaptionExpanded]);

  return (
    <>
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: '#000',
            opacity: bgOpacity,
          },
        ]}
      />
      <Pressable onPress={handleBackgroundPress} style={styles.container}>
        <View style={styles.footer}>
          <View style={styles.detailsColumn}>
            <View style={styles.detailsColTitle}>
              <AppAvatar
                uri={post.post.postedBy.profileImage}
                size={35}
                style={styles.profileImage}
              />
              <Title />
            </View>
            <View
              style={[
                styles.nameAndFollowContainer,
                dynamicStyles.nameAndFollowContainer,
              ]}
            >
              <LinkText
                style={styles.username}
                onPress={handleOpenPostedByProfile}
              >
                @{post.post.postedBy.username}
              </LinkText>
              {post.post.postedBy.id !== user?.id && (
                <ToggleButton
                  isToggled={followingPoster}
                  mode="contained"
                  onPress={followUser}
                  style={styles.followingButton}
                  notToggledLabel="Follow"
                  notToggledLabelStyle={[
                    styles.notToggledLabelStyle,
                    { color: 'black' },
                  ]}
                  notToggledStyle={[
                    styles.notToggledStyle,
                    { backgroundColor: 'white' },
                  ]}
                  toggledLabel="Following"
                  toggledLabelStyle={{ color: colors.background }}
                  toggledStyle={[
                    styles.toggled,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
            <Caption
              animationSpeed={ANIMATION_SPEED}
              isCaptionExpanded={isCaptionExpanded}
              setIsCaptionExpanded={setIsCaptionExpanded}
            >
              {post.post.caption}
            </Caption>
          </View>
          <ActionsColumn />
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  followingButton: {
    marginLeft: 10,
    height: 22,
    width: 80,
  },

  toggled: {},

  notToggledLabelStyle: {
    color: '#fff',
  },

  notToggledStyle: {
    borderColor: '#fff',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  detailsColTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: { marginRight: 6 },
  footer: {
    flexDirection: 'row',
  },
  nameAndFollowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    shadowColor: 'hsla(0, 0%, 15%, 1)',
    shadowOpacity: 1,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 4,
  },
  buttonTitle: { fontWeight: 'normal' },
  detailsColumn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  username: {
    color: '#fff',
  },
});
