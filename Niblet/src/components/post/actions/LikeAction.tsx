import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image, StyleProp, TextStyle } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import { Text } from 'react-native-paper';

import { ACTION_STYLES } from '@src/components/post/actions/ActionsConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@src/hooks/useTheme';

type LikeActionProps = {
  requesterLiked: boolean;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
  id: string;
  likeCount: number;
  iconSize: number;
  /** @default 'outlined' */
  mode?: 'outlined' | 'filled';
  notLikedColor?: string;
  textStyle?: StyleProp<TextStyle>;
};

export const LikeAction = ({
  likeCount,
  onLike,
  onUnlike,
  requesterLiked,
  id,
  iconSize,
  mode = 'filled',
  notLikedColor = '#fff',
  textStyle,
}: LikeActionProps) => {
  const isLiked = requesterLiked;
  const { colors } = useTheme();
  const [likeColor, setLikedColor] = useState(
    isLiked ? colors.like : notLikedColor,
  );
  const isFirstRender = useRef(true);

  const heartIconSize = useMemo(() => (iconSize / 35) * 78, [iconSize]);

  const handleLayout = () => (isFirstRender.current = false);

  const handleLike = () => {
    setLikedColor(notLikedColor);
    isLiked ? onUnlike(id) : onLike(id);
  };

  const handleAnimationFinish = () => setLikedColor(colors.like);

  const shouldAnimate = useMemo(() => {
    // Do not animate on first render, if the user already liked
    if (!isFirstRender.current && isLiked) return true;
    return false;
  }, [isLiked]);

  const displayedCount = useMemo(() => {
    return likeCount;
  }, [likeCount]);

  return (
    <TouchableOpacity
      hitSlop={{ left: 10, right: 10 }}
      onPress={handleLike}
      style={ACTION_STYLES.container}
    >
      <View
        onLayout={handleLayout}
        style={[styles.iconContainer, { width: iconSize, height: iconSize }]}
      >
        <Image
          source={
            mode === 'outlined' && !isLiked
              ? require('@src/assets/like-outline.png')
              : require('@src/assets/like.png')
          }
          style={{
            width: iconSize,
            height: iconSize,
            tintColor: likeColor,
          }}
        />
        {shouldAnimate && (
          <AnimatedLottieView
            source={require('@src/assets/animations/like')}
            autoPlay
            speed={1}
            loop={false}
            onAnimationFinish={handleAnimationFinish}
            style={[
              {
                width: heartIconSize, // The animated heart has a lot of
                height: heartIconSize, // padding that needs compensated for.
              },
              styles.animatedIcon,
            ]}
          />
        )}
      </View>
      <Text style={[ACTION_STYLES.text, textStyle]}>{displayedCount}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedIcon: { position: 'absolute' },
});
