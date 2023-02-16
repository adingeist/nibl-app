import React, { ComponentProps } from 'react';
import { FlatList } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';

import {
  OpenProfilePostHandler,
  PostThumbnail,
} from '@src/components/profile/PostThumbnail';
import { NoResults } from '@src/components/NoResults';
import { FeedRecipeOrNibDtoType } from '@shared/types/routes/feed.controller';

type MediaListTabProps = {
  onOpenImage: OpenProfilePostHandler;
} & Omit<ComponentProps<typeof FlatList<FeedRecipeOrNibDtoType>>, 'renderItem'>;

export const MediaListTab = ({
  onOpenImage,
  data,
  ...props
}: MediaListTabProps) => {
  // List is loaded an empty
  if (data?.length === 0) {
    return (
      <Tabs.ScrollView
        accessibilityComponentType={{}}
        accessibilityTraits={{}}
        showsVerticalScrollIndicator={false}
      >
        <NoResults>No Posts</NoResults>
      </Tabs.ScrollView>
    );
  }

  // List is loading or has items
  return (
    <Tabs.FlatList
      {...props}
      data={data}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <PostThumbnail onOpenImage={onOpenImage} index={index} item={item} />
      )}
    />
  );
};
