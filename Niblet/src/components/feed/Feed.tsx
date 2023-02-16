import React, { ComponentProps, Reducer, useCallback, useReducer } from 'react';

import { findIndexOfId } from '@src/util/findIndexOfId';
import { PostCardFlatList } from '@src/components/PostCardFlatList';
import { useOnMount } from '@src/hooks/useOnMount';
import { FeedRecipeOrNibDtoType } from '@shared/types/routes/feed.controller';
import { Text } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type FeedState = {
  posts: FeedRecipeOrNibDtoType[];
  onPage: number;
  pageCount?: number | undefined;
};

export type FeedAction =
  | {
      type: 'PUSH_PAGE';
      newItems: FeedRecipeOrNibDtoType[];
      pageCount?: number | undefined;
    }
  | { type: 'LIKE_POST'; postId: string }
  | { type: 'UNLIKE_POST'; postId: string }
  | { type: 'DELETE_POST'; postId: string };

const reducer: Reducer<FeedState, FeedAction> = (state, action) => {
  const newPosts = [...state.posts];

  switch (action.type) {
    case 'PUSH_PAGE':
      return {
        ...state,
        pageCount: action.pageCount,
        onPage: state.onPage + 1,
        posts: [...state.posts, ...action.newItems],
      };

    case 'LIKE_POST': {
      const postIndex = findIndexOfId(newPosts, action.postId);

      newPosts[postIndex].post.requesterLiked = true;
      newPosts[postIndex].post.likeCount += 1;

      return { ...state, posts: newPosts };
    }

    case 'UNLIKE_POST': {
      const postIndex = findIndexOfId(newPosts, action.postId);

      newPosts[postIndex].post.requesterLiked = false;
      newPosts[postIndex].post.likeCount -= 1;

      return { ...state, posts: newPosts };
    }

    case 'DELETE_POST': {
      const postIndex = findIndexOfId(newPosts, action.postId);

      newPosts.splice(postIndex, 1);

      return { ...state, posts: newPosts };
    }

    default:
      return state;
  }
};

type FeedProps = {
  onEndReached: (
    state: FeedState,
    dispatch: React.Dispatch<FeedAction>,
  ) => void;
  noContentMessage?: string | undefined;
  noContentIcon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  isFollowerFeed?: boolean;
};

const FeedComponent = ({
  onEndReached,
  noContentMessage = '',
  noContentIcon,
  isFollowerFeed,
}: FeedProps) => {
  const [state, dispatch] = useReducer(reducer, {
    posts: [],
    onPage: 0,
    pageCount: undefined,
  });

  const handleLike = useCallback((postId: string) => {
    dispatch({ type: 'LIKE_POST', postId });
  }, []);

  const handleUnlike = useCallback((postId: string) => {
    dispatch({ type: 'UNLIKE_POST', postId });
  }, []);

  const handleEndReached = useCallback(() => {
    onEndReached(state, dispatch);
  }, [onEndReached, state]);

  const handleDelete = useCallback((postId: string) => {
    dispatch({ type: 'DELETE_POST', postId });
  }, []);

  useOnMount(() => {
    onEndReached(state, dispatch);
  });

  return (
    <View style={styles.container}>
      <PostCardFlatList
        isFollowerFeed={isFollowerFeed}
        data={state.posts}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onEndReached={handleEndReached}
        onDelete={handleDelete}
      />
      {state.posts.length === 0 && (
        <View style={styles.noContentContainer}>
          {noContentIcon && (
            <MaterialCommunityIcons
              color="#999"
              size={50}
              name={noContentIcon}
            />
          )}
          <Text style={styles.noContentText} variant="bodyLarge">
            {noContentMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export const Feed = React.memo(FeedComponent);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  noContentContainer: {
    position: 'absolute',
    width: 320,
    alignItems: 'center',
  },

  noContentText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
  },
});
