import React, { createRef, useCallback, useState } from 'react';

import { Feed, FeedAction, FeedState } from '@src/components/feed/Feed';
import { feedApi } from '@src/api/feed';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useApi } from '@src/hooks/useApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FeedScreen = () => {
  const [folFeedShown, setFolFeedShown] = useState(false);
  const { top } = useSafeAreaInsets();
  const getFeedApi = useApi(feedApi.getFeed);
  const getFolFeedApi = useApi(feedApi.getFollowingFeed);
  const scrollViewRef = createRef<ScrollView>();

  const toggleFolFeedShown = useCallback(() => {
    if (folFeedShown) {
      scrollViewRef.current?.scrollTo({
        x: 0,
        animated: true,
      });
    } else {
      scrollViewRef.current?.scrollTo({
        x: Dimensions.get('window').width,
        animated: true,
      });
    }
    setFolFeedShown((val) => !val);
  }, [folFeedShown, scrollViewRef]);

  const getFeed = useCallback(
    async (
      api: typeof getFeedApi | typeof getFolFeedApi,
      state: FeedState,
      dispatch: React.Dispatch<FeedAction>,
    ) => {
      if (
        api.isLoadingSync.current ||
        (state.pageCount && state.onPage >= state.pageCount)
      ) {
        return;
      }

      const res = await api.request({ query: {} });
      if (res.ok && res.data) {
        dispatch({
          type: 'PUSH_PAGE',
          newItems: res.data.posts,
          pageCount: res.data.pageCount,
        });
      }
    },
    [],
  );

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        scrollEnabled={false}
        style={styles.scrollView}
        horizontal
      >
        <Feed
          noContentIcon="emoticon-confused-outline"
          noContentMessage="There's no content available right now. Check back soon!"
          onEndReached={(state, dispatch) =>
            getFeed(getFeedApi, state, dispatch)
          }
        />
        <Feed
          isFollowerFeed
          noContentIcon="heart"
          noContentMessage="Follow other users to see more of the accounts you love!"
          onEndReached={(state, dispatch) =>
            getFeed(getFolFeedApi, state, dispatch)
          }
        />
      </ScrollView>
      <View style={[styles.overlay, { top: top + 5 }]}>
        <Text
          onPress={toggleFolFeedShown}
          style={[{ color: !folFeedShown ? '#fff' : '#999' }, styles.feedText]}
          variant="bodyLarge"
        >
          Feed
        </Text>
        <Text
          onPress={toggleFolFeedShown}
          style={[
            { color: folFeedShown ? '#fff' : '#999' },
            styles.followingText,
          ]}
          variant="bodyLarge"
        >
          Following
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },

  scrollView: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
  },

  feedText: {
    marginRight: 15,
  },

  followingText: {
    marginLeft: 15,
  },
});
