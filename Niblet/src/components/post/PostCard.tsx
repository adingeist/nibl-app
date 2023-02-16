import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { CardOverlay } from '@src/components/post/CardOverlay';
import { PostContextProvider } from '@src/components/post/PostContext';
import { FeedRecipeOrNibDtoType } from '@shared/types/routes/feed.controller';

const SCREEN = Dimensions.get('screen');

export type PostCardProps = {
  active: boolean;
  height: number;
  post: FeedRecipeOrNibDtoType;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onDelete: (postId: string) => void;
};

export const PostCardComponent = ({
  post,
  active,
  height,
  onLike,
  onUnlike,
  onDelete,
}: PostCardProps) => {
  const video = React.useRef<Video>(null);

  return (
    <PostContextProvider value={{ ...post, onLike, onUnlike, onDelete }}>
      <View style={[styles.container, { height }]}>
        <Video
          posterSource={{ uri: post.post.banner }}
          usePoster
          shouldPlay={active}
          ref={video}
          style={styles.video}
          source={{ uri: post.post.video }}
          resizeMode={ResizeMode.COVER}
          isLooping
        />
        <CardOverlay />
      </View>
    </PostContextProvider>
  );
};

export const PostCard = React.memo(PostCardComponent);

const styles = StyleSheet.create({
  container: {
    width: SCREEN.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  video: {
    flex: 1,
    width: '100%',
  },
});
