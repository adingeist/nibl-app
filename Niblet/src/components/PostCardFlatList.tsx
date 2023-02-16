import React, {
  ComponentProps,
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';

import { PostCard, PostCardProps } from '@src/components/post/PostCard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { FeedRecipeOrNibDtoType } from '@shared/types/routes/feed.controller';

export type PostCardFlatList = React.ElementRef<typeof PostCardFlatList>;

type PostCardFlatListProps = {
  isFollowerFeed?: boolean;
  onLike: PostCardProps['onLike'];
  onUnlike: PostCardProps['onUnlike'];
  onDelete: PostCardProps['onDelete'];
  startDisabled?: boolean;
} & Omit<ComponentProps<typeof FlatList<FeedRecipeOrNibDtoType>>, 'renderItem'>;

type PostCardFlatListHandle = {
  setActiveIndexTo: (index: number) => void;
  scrollToIndex: (params: {
    animated?: boolean | null | undefined;
    index: number;
    viewOffset?: number | undefined;
    viewPosition?: number | undefined;
  }) => void;
};

const PostCardFlatListComponent: ForwardRefRenderFunction<
  PostCardFlatListHandle,
  PostCardFlatListProps
> = (
  {
    onLike,
    onUnlike,
    onDelete,
    data,
    onScroll,
    startDisabled,
    isFollowerFeed,
    ...props
  },
  ref,
) => {
  const tabHeight = useBottomTabBarHeight();
  const [feedVisible, setFeedVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(startDisabled ? -1 : 0);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    React.useCallback(() => {
      setFeedVisible(true);

      return () => setFeedVisible(false);
    }, []),
  );

  useImperativeHandle(ref, () => ({
    setActiveIndexTo(index) {
      setActiveIndex(index);
    },

    scrollToIndex(params) {
      flatListRef.current?.scrollToIndex(params);
    },
  }));

  const postHeight = useMemo(
    () => Dimensions.get('window').height - tabHeight,
    [tabHeight],
  );

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (activeIndex == -1) {
      return; // disabled -- must be set to anything other than 1 manually to enable
    }

    const scrollTraveled = e.nativeEvent.contentOffset.y;
    setActiveIndex(Math.round(scrollTraveled / postHeight));
    if (onScroll) onScroll(e);
  };

  const [extraData, setExtraData] = useState(false);

  const handleLike = (postId: string) => {
    setExtraData((state) => !state);
    onLike(postId);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: FeedRecipeOrNibDtoType; index: number }) => (
      <PostCard
        height={postHeight}
        post={item}
        active={feedVisible && index === activeIndex}
        onLike={handleLike}
        onUnlike={onUnlike}
        onDelete={onDelete}
      />
    ),
    [activeIndex, feedVisible, handleLike, onDelete, onUnlike, postHeight],
  );

  return (
    <FlatList
      data={data}
      extraData={extraData}
      renderItem={renderItem}
      keyExtractor={(post) =>
        `${isFollowerFeed ? 'folFeed' : 'feed'}-${post.id}`
      }
      pagingEnabled
      onScroll={handleScroll}
      showsVerticalScrollIndicator={false}
      style={styles.flatList}
      ref={flatListRef}
      onScrollToIndexFailed={({ index, averageItemLength }) => {
        flatListRef.current?.scrollToOffset({
          offset: index * averageItemLength,
          animated: false,
        });
      }}
      {...props}
    />
  );
};

const PostCardFlatListForwardRef = forwardRef(PostCardFlatListComponent);

export const PostCardFlatList = React.memo(PostCardFlatListForwardRef);

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: '#000',
  },
});
