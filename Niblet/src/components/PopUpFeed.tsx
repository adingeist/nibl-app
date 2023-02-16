import React, {
  ForwardRefRenderFunction,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet } from 'react-native';

import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';
import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { PostCardFlatList } from '@src/components/PostCardFlatList';
import { PostCardProps } from '@src/components/post/PostCard';

export type PopUpFeed = React.ElementRef<typeof PopUpFeed>;

type PopUpFeedProps = {
  listViewXY: Animated.ValueXY;
  listViewWidthHeight: Animated.ValueXY;
  pan: Animated.ValueXY & { x: { _value: number }; y: { _value: number } };
  data: FeedRecipeDtoType[] | FeedNibDtoType[];
  toggleLike: (postId: string) => void;
  onDelete: PostCardProps['onDelete'];
  flatListRef: RefObject<PostCardFlatList>;
};

type PopUpFeedHandle = {
  swipeAwayPostView: () => void;
};

const PopUpFeedComponent: ForwardRefRenderFunction<
  PopUpFeedHandle,
  PopUpFeedProps
> = (
  {
    listViewXY,
    listViewWidthHeight,
    pan,
    data,
    toggleLike,
    onDelete,
    flatListRef,
  },
  ref,
) => {
  const swipeAwayPostView = useCallback(() => {
    Animated.timing(pan, {
      duration: 100,
      useNativeDriver: false,
      toValue: {
        x: Dimensions.get('screen').width,
        y: 0,
      },
    }).start();

    if (flatListRef) {
      flatListRef.current?.setActiveIndexTo(-1);
    }
  }, [flatListRef, pan]);

  const resetPanOffset = useCallback(() => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (gestureState.dx > 25 && gestureState.dy < 100) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        if (pan.x._value > 100) {
          swipeAwayPostView();
        } else {
          resetPanOffset();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (data.length === 0) {
      swipeAwayPostView();
    }
  }, [data.length, swipeAwayPostView]);

  useImperativeHandle(ref, () => ({
    swipeAwayPostView() {
      swipeAwayPostView();
    },
  }));

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            left: listViewXY.x,
            top: listViewXY.y,
            width: listViewWidthHeight.x,
            height: listViewWidthHeight.y,

            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
          styles.container,
        ]}
      >
        <PostCardFlatList
          startDisabled
          data={data}
          onLike={toggleLike}
          onUnlike={toggleLike}
          onDelete={onDelete}
          ref={flatListRef}
        />
      </Animated.View>
    </>
  );
};

const PopUpFeedForwardRef = React.forwardRef(PopUpFeedComponent);

export const PopUpFeed = React.memo(PopUpFeedForwardRef);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 5,
    elevation: 5,
  },
});
