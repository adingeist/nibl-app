import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ICON_SIZE } from '@src/components/post/actions/ActionsConstants';
import { LikeAction } from '@src/components/post/actions/LikeAction';
import { SeeCommentsAction } from '@src/components/post/actions/SeeCommentsAction';
import { ShareAction } from '@src/components/post/actions/ShareAction';
import { usePostContext } from '@src/components/post/PostContext';
import MoreAction from '@src/components/post/actions/MoreAction';

export const ActionsColumn = () => {
  const state = usePostContext();

  return (
    <View style={styles.actions}>
      <LikeAction
        id={state.id}
        likeCount={state.post.likeCount}
        onLike={state.onLike}
        onUnlike={state.onUnlike}
        requesterLiked={state.post.requesterLiked}
        iconSize={ICON_SIZE}
      />
      <SeeCommentsAction />
      <ShareAction />
      <MoreAction />
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: 12,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});
