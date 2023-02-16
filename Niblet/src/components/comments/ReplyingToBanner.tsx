import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AppAvatar } from '@src/components/AppAvatar';
import { useTheme } from '@src/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CommentDto } from '@shared/types/dto/Comment.entity';

type ReplyingToBannerProps = {
  replyingToComment: CommentDto;
  onCancelReply: () => void;
};

const ReplyingToBannerComponent = ({
  replyingToComment,
  onCancelReply,
}: ReplyingToBannerProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.replyingToBanner,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.light,
          paddingHorizontal: theme.screenMargin,
        },
      ]}
    >
      <AppAvatar size={20} uri={replyingToComment.postedBy.profileImage} />
      <Text style={{ marginLeft: theme.screenMargin }} variant="bodyMedium">
        Replying to {replyingToComment.postedBy.username}
      </Text>
      <MaterialCommunityIcons
        name="close"
        style={styles.closeIcon}
        color={theme.colors.oppositeBackground}
        size={20}
        onPress={onCancelReply}
      />
    </View>
  );
};

export const ReplyingToBanner = React.memo(ReplyingToBannerComponent);

const styles = StyleSheet.create({
  replyingToBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },

  closeIcon: {
    marginLeft: 'auto',
  },
});
