import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

import { AppAvatar } from '@src/components/AppAvatar';
import { LinkText } from '@src/components/LinkText';
import { LikeAction } from '@src/components/post/actions/LikeAction';
import { useNavigation } from '@react-navigation/native';
import { MainAppNavigationProp } from '@src/types/navigation';
import { useTheme } from '@src/hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppModal } from '@src/components/modal/AppModal';
import { ListItem } from '@src/components/modal/ListItem';
import { LoadReplies } from '@src/components/comments/LoadReplies';
import { CommentDto } from '@shared/types/dto/Comment.entity';

type CommentProps = {
  body: string;
  requesterLiked: boolean;
  onLike: (commentId: string) => void;
  onUnlike: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLoadCommentReplies: (commentId: string) => void;
  likeCount: number;
  postedBy: {
    username: string;
    image?: string;
  };
  createdAt: string;
  onPressReply: (commentId: string) => void;
  style: StyleProp<ViewStyle>;
  isLoadingReplies: boolean;
  isBeingRepliedTo: boolean;
  rootParentId?: string;
  replyCount: number;
  onReplyPage: number;
  replyPageCount: number | undefined;
  id: string;
  firstParent: CommentDto['firstParent'];
};

const CommentComponent = ({
  isBeingRepliedTo,
  body,
  id,
  likeCount,
  postedBy,
  requesterLiked,
  onLike,
  onUnlike,
  createdAt,
  onPressReply,
  style,
  rootParentId,
  onDeleteComment,
  isLoadingReplies,
  onReplyPage,
  replyPageCount,
  onLoadCommentReplies,
  replyCount,
  firstParent,
}: CommentProps) => {
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const navigation = useNavigation<MainAppNavigationProp>();
  const theme = useTheme();

  const handlePostedByPress = useCallback(() => {
    navigation.push('Profile', { username: postedBy.username });
  }, [navigation, postedBy.username]);

  const time = useMemo(() => {
    const now = new Date(Date.now()).getTime();

    const date = new Date(createdAt).getTime() - 1.8e7;

    const diff = now - date;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    const weeks = Math.floor(diff / 1000 / 60 / 60 / 24 / 7);

    if (seconds < 60) {
      return `${seconds}s`;
    } else if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return `${weeks}w`;
    }
  }, [createdAt]);

  const handlePressReply = useCallback(() => {
    onPressReply(id);
  }, [id, onPressReply]);

  const backgroundColor = useMemo(
    () => (isBeingRepliedTo ? theme.colors.light : theme.colors.background),
    [isBeingRepliedTo, theme.colors.background, theme.colors.light],
  );

  const handleDeleteComment = useCallback(() => {
    onDeleteComment(id);
    setMoreModalVisible(false);
  }, [id, onDeleteComment]);

  const showMoreModal = useCallback(() => {
    setMoreModalVisible(true);
  }, []);

  const hideMoreModal = useCallback(() => {
    setMoreModalVisible(false);
  }, []);

  const isLoadReplyButtonVisible = useMemo(() => {
    const hasReplies = replyCount > 0;

    const notOnLastPage =
      replyPageCount === undefined || onReplyPage < replyPageCount - 1;

    return hasReplies && notOnLastPage;
  }, [onReplyPage, replyCount, replyPageCount]);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            paddingLeft: rootParentId
              ? theme.screenMargin * 2.5
              : theme.screenMargin,
          },
          style,
        ]}
      >
        <AppAvatar
          onPress={handlePostedByPress}
          uri={postedBy.image}
          size={30}
          style={{ marginRight: theme.screenMargin }}
        />

        <View style={styles.textContainer}>
          <View style={styles.usernameContainer}>
            <LinkText onPress={handlePostedByPress} variant="bodyMedium">
              {postedBy.username}
            </LinkText>
            {firstParent && (
              <>
                <MaterialCommunityIcons
                  style={styles.usernameArrowIcon}
                  color={theme.colors.dark}
                  name="menu-right"
                  size={20}
                />
                <LinkText onPress={handlePostedByPress} variant="bodyMedium">
                  {firstParent.postedBy.username}
                </LinkText>
              </>
            )}
          </View>

          <Text variant="bodyMedium">{body}</Text>

          <View style={styles.actionsContainer}>
            <Text
              style={[styles.action, { color: theme.colors.dark }]}
              variant="bodySmall"
            >
              {time}
            </Text>
            <LinkText
              style={[styles.action, { color: theme.colors.dark }]}
              onPress={handlePressReply}
              variant="bodySmall"
            >
              Reply
            </LinkText>
            <MaterialCommunityIcons
              style={styles.action}
              size={20}
              onPress={showMoreModal}
              color={theme.colors.dark}
              name="dots-horizontal"
            />
          </View>
        </View>

        <LikeAction
          mode="outlined"
          iconSize={20}
          id={id}
          likeCount={likeCount}
          onLike={() => onLike(id)}
          onUnlike={() => onUnlike(id)}
          requesterLiked={requesterLiked}
          notLikedColor={theme.colors.oppositeBackground}
          textStyle={[
            { color: theme.colors.oppositeBackground },
            styles.likeText,
          ]}
        />
      </View>

      <LoadReplies
        id={id}
        isVisible={isLoadReplyButtonVisible}
        onLoadCommentReplies={onLoadCommentReplies}
        isLoading={isLoadingReplies}
      />

      <AppModal onBackdropPress={hideMoreModal} isVisible={moreModalVisible}>
        <ListItem
          text="Delete comment"
          iconName="trash-can-outline"
          onPress={handleDeleteComment}
        />
      </AppModal>
    </>
  );
};

export const Comment = React.memo(CommentComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },

  actionsContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },

  action: {
    marginRight: 10,
  },

  textContainer: {
    flex: 1,
  },

  likeText: {
    fontWeight: '600',
  },

  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  usernameArrowIcon: {
    marginHorizontal: 2,
  },
});
