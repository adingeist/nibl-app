import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { FeedRecipeOrNibDtoType } from '@src/components/profile/MediaListTab';
import { useTheme } from '@src/hooks/useTheme';

const windowWidth = Dimensions.get('window').width;
export const postThumbnailWidth = windowWidth / 3;
export const postThumbnailHeight = windowWidth / 2.5;

export type OpenProfilePostHandler = (
  index: number,
  postType: FeedRecipeOrNibDtoType['postType'],
  x: number,
  y: number,
) => void;

export type PostThumbnailProps = {
  item: FeedRecipeOrNibDtoType;
  index: number;
  onOpenImage: OpenProfilePostHandler;
};

const PostThumbnailComponent = ({
  item,
  index,
  onOpenImage,
}: PostThumbnailProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={(e) => {
        const x = postThumbnailWidth * (index % 3);
        const y = e.nativeEvent.pageY - postThumbnailHeight / 2;

        onOpenImage(index, item.postType, x, y);
      }}
    >
      <Image
        source={{ uri: item.post.thumbnail }}
        resizeMode="cover"
        style={[
          {
            width: postThumbnailWidth,
            height: postThumbnailHeight,
            borderColor: colors.background,
          },
          styles.image,
        ]}
      />
    </TouchableOpacity>
  );
};

export const PostThumbnail = React.memo(PostThumbnailComponent);

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
  },
});
