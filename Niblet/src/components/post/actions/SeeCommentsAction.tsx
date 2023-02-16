import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import {
  ACTION_STYLES,
  ICON_SIZE,
} from '@src/components/post/actions/ActionsConstants';
import { usePostContext } from '@src/components/post/PostContext';
import { useNavigation } from '@react-navigation/native';
import { MainAppNavigationProp } from '@src/types/navigation';

export const SeeCommentsAction = () => {
  const entity = usePostContext();
  const navigation = useNavigation<MainAppNavigationProp>();

  const makeCommentModalVisible = useCallback(() => {
    navigation.navigate('CommentsModal', { postId: entity.post.id });
  }, [navigation, entity.post.id]);

  return (
    <>
      <TouchableOpacity
        onPress={makeCommentModalVisible}
        style={ACTION_STYLES.container}
      >
        <MaterialCommunityIcons
          name={'comment'}
          size={ICON_SIZE}
          color="#fff"
        />
        <Text style={ACTION_STYLES.text}>{entity.post.commentCount}</Text>
      </TouchableOpacity>
    </>
  );
};
