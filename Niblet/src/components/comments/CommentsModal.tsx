import React, {
  createRef,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Keyboard, TextInput as RNTextInput } from 'react-native';

import {
  PostCommentForm,
  PostCommentFormValues,
} from '@src/components/comments/PostCommentForm';
import { Comment } from '@src/components/comments/Comment';
import { commentApi } from '@src/api/comment';
import { CommentDto } from '@shared/types/dto/Comment.entity';
import { ExpandableModal } from '@src/components/ExpandableModal';
import { FormikSubmitHandler } from '@src/types/formik';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { likeApi } from '@src/api/like';
import { MainAppScreenProps } from '@src/types/navigation';
import { useApi } from '@src/hooks/useApi';
import { useAuthContext } from '@src/auth';
import { useTheme } from '@src/hooks/useTheme';

type StateType = {
  comments: (CommentDto & {
    isLoadingReplies: boolean;
    onReplyPage: number;
    replyPageCount?: number;
  })[];
  commentsPage: number;
  replyingToCommentId?: string;
  totalPages?: number;
};

const initialState: StateType = {
  comments: [],
  commentsPage: 0,
  totalPages: undefined,
  replyingToCommentId: undefined,
};

const mapOnReplyPage0 = (...comments: CommentDto[]): StateType['comments'] =>
  comments.map((comment) => ({
    ...comment,
    onReplyPage: 0,
    replyPageCount: undefined,
    isLoadingReplies: false,
  }));

type ActionType =
  | {
      type: 'PUSH_COMMENT_TO_INDEX';
      comment: CommentDto;
      index: number;
    }
  | { type: 'PUSH_COMMENT_PAGE'; comments: CommentDto[]; totalPages: number }
  | {
      type: 'PUSH_LOADED_COMMENT_REPLY_PAGE';
      replies: CommentDto[];
      replyPageCount: number;
      commentId: string;
    }
  | { type: 'LIKE_COMMENT'; commentId: string }
  | { type: 'BEING_LOADING_REPLIES_AT_ID'; commentId: string }
  | { type: 'FAILED_LOADING_REPLIES_AT_ID'; commentId: string }
  | { type: 'UNLIKE_COMMENT'; commentId: string }
  | { type: 'BEGIN_REPLY_TO_COMMENT'; commentId: string }
  | { type: 'CANCEL_REPLY_TO_COMMENT' }
  | { type: 'DELETE_COMMENT'; commentId: string };

const findIndexOfCommentId = (comments: CommentDto[], id: string) =>
  comments.findIndex((comment) => comment.id === id);

const reducer: Reducer<StateType, ActionType> = (state, action): StateType => {
  switch (action.type) {
    case 'PUSH_COMMENT_PAGE':
      return {
        ...state,
        commentsPage: state.commentsPage + 1,
        totalPages: action.totalPages,
        comments: [...state.comments, ...mapOnReplyPage0(...action.comments)],
      };

    case 'BEING_LOADING_REPLIES_AT_ID': {
      const newComments = [...state.comments];
      const loadIndex = findIndexOfCommentId(state.comments, action.commentId);
      newComments[loadIndex].isLoadingReplies = true;
      return { ...state };
    }

    case 'FAILED_LOADING_REPLIES_AT_ID': {
      const newComments = [...state.comments];
      const loadIndex = findIndexOfCommentId(state.comments, action.commentId);
      newComments[loadIndex].isLoadingReplies = false;
      return { ...state };
    }

    case 'PUSH_LOADED_COMMENT_REPLY_PAGE': {
      const index = findIndexOfCommentId(state.comments, action.commentId);

      if (index === -1) return state;

      const newComments = [...state.comments];

      newComments[index].onReplyPage++;
      newComments[index].replyPageCount = action.replyPageCount;
      newComments[index].isLoadingReplies = false;

      newComments.splice(index + 1, 0, ...mapOnReplyPage0(...action.replies));

      return { ...state, comments: newComments };
    }

    case 'PUSH_COMMENT_TO_INDEX': {
      const newComments = [...state.comments];
      newComments.splice(action.index, 0, ...mapOnReplyPage0(action.comment));
      return {
        ...state,
        replyingToCommentId: undefined,
        comments: newComments,
      };
    }

    case 'LIKE_COMMENT': {
      const index = findIndexOfCommentId(state.comments, action.commentId);

      if (index === -1) return state;

      const newComments = [...state.comments];
      newComments[index].likeCount++;
      newComments[index].requesterLiked = true;
      return { ...state, comments: newComments };
    }

    case 'UNLIKE_COMMENT': {
      const index = findIndexOfCommentId(state.comments, action.commentId);

      if (index === -1) return state;

      const newComments = [...state.comments];
      newComments[index].likeCount--;
      newComments[index].requesterLiked = false;
      return { ...state, comments: newComments };
    }

    case 'BEGIN_REPLY_TO_COMMENT':
      return { ...state, replyingToCommentId: action.commentId };

    case 'CANCEL_REPLY_TO_COMMENT':
      return { ...state, replyingToCommentId: undefined };

    case 'DELETE_COMMENT': {
      const index = findIndexOfCommentId(state.comments, action.commentId);

      if (index === -1) return state;

      const newComments = [...state.comments];
      newComments.splice(index, 1);
      return { ...state, comments: newComments };
    }

    default:
      return state;
  }
};

export const CommentsModal = ({
  route,
}: MainAppScreenProps<'CommentsModal'>) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const { user } = useAuthContext();
  const inputRef = createRef<RNTextInput>();
  const expandableRef = createRef<ExpandableModal>();

  const postCommentApi = useApi(commentApi.postComment);
  const deleteCommentApi = useApi(commentApi.deleteComment);
  const getCommentsApi = useApi(commentApi.getComments);
  const getCommentRepliesApi = useApi(commentApi.getCommentReplies);

  const getComments = useCallback(async () => {
    if (state.commentsPage === state.totalPages || getCommentsApi.isLoading) {
      return;
    }

    const res = await getCommentsApi.request({
      params: { postId: route.params.postId },
      query: { page: state.commentsPage },
    });

    if (res.ok && res.data) {
      dispatch({
        type: 'PUSH_COMMENT_PAGE',
        comments: res.data.comments,
        totalPages: res.data.pageCount,
      });
    }
  }, [
    getCommentsApi,
    route.params.postId,
    state.commentsPage,
    state.totalPages,
  ]);

  useEffect(() => {
    getComments();
  }, []);

  const replyingToIndex = useMemo(() => {
    if (state.replyingToCommentId === undefined) return;
    else return findIndexOfCommentId(state.comments, state.replyingToCommentId);
  }, [state.comments, state.replyingToCommentId]);

  const handleSubmit: FormikSubmitHandler<PostCommentFormValues> = useCallback(
    async ({ body }, { setFieldValue }) => {
      if (!user) return;

      let firstParentId: string | undefined;
      let rootParentId: string | undefined;
      let insertAtIndex = 0;

      if (replyingToIndex) {
        insertAtIndex = replyingToIndex + 1;
        firstParentId = state.comments[replyingToIndex].id;
        const rootId = state.comments[replyingToIndex].rootParentId;
        rootParentId = rootId ? rootId : firstParentId;
      }

      const res = await postCommentApi.request({
        body: { body, rootParentId, firstParentId },
        params: { postId: route.params.postId },
      });

      if (res.ok && res.data) {
        dispatch({
          type: 'PUSH_COMMENT_TO_INDEX',
          comment: res.data,
          index: insertAtIndex,
        });
      }

      setFieldValue('body', '', false);
      Keyboard.dismiss();
    },
    [
      postCommentApi,
      replyingToIndex,
      route.params.postId,
      state.comments,
      user,
    ],
  );

  const handleLoadCommentReplies = useCallback(
    async (commentId: string) => {
      const index = findIndexOfCommentId(state.comments, commentId);

      if (index === -1) return;

      const comment = state.comments[index];

      if (
        comment.replyPageCount &&
        comment.onReplyPage > comment.replyPageCount - 1
      ) {
        return;
      }

      dispatch({
        type: 'BEING_LOADING_REPLIES_AT_ID',
        commentId,
      });

      const res = await getCommentRepliesApi.request({
        params: { commentId: comment.id, postId: route.params.postId },
        query: { page: comment.onReplyPage, perPage: 5 },
      });

      if (res.ok && res.data) {
        dispatch({
          type: 'PUSH_LOADED_COMMENT_REPLY_PAGE',
          replies: res.data.replies,
          replyPageCount: res.data.pageCount,
          commentId,
        });
      } else {
        dispatch({
          type: 'FAILED_LOADING_REPLIES_AT_ID',
          commentId,
        });
      }
    },

    [getCommentRepliesApi, route.params.postId, state.comments],
  );

  const handlePressReply = useCallback(
    (commentId: string) => {
      if (inputRef.current) {
        inputRef.current.focus();
        dispatch({ type: 'BEGIN_REPLY_TO_COMMENT', commentId });
      }
    },
    [inputRef],
  );

  const handleCancelReply = useCallback(() => {
    dispatch({ type: 'CANCEL_REPLY_TO_COMMENT' });
  }, []);

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      const res = await deleteCommentApi.request({ params: { commentId } });

      if (res.ok) {
        dispatch({ type: 'DELETE_COMMENT', commentId });
      }
    },
    [deleteCommentApi],
  );

  const replyingToComment = useMemo(() => {
    if (!state.replyingToCommentId) return;

    const index = findIndexOfCommentId(
      state.comments,
      state.replyingToCommentId,
    );

    if (index === -1) return;

    return state.comments[index];
  }, [state.comments, state.replyingToCommentId]);

  const handleCommentLike = useCallback(async (commentId: string) => {
    const res = await likeApi.likeComment({ params: { id: commentId } });

    dispatch({ type: 'LIKE_COMMENT', commentId });
    if (!res.ok) {
      dispatch({ type: 'UNLIKE_COMMENT', commentId });
    }
  }, []);

  const handleCommentUnlike = useCallback(async (commentId: string) => {
    const res = await likeApi.unlikeComment({ params: { id: commentId } });

    dispatch({ type: 'UNLIKE_COMMENT', commentId });
    if (!res.ok) {
      dispatch({ type: 'LIKE_COMMENT', commentId });
    }
  }, []);

  return (
    <ExpandableModal
      snapPoints={[0.5, 0.82]}
      ref={expandableRef}
      keyboardAccessoryChildren={
        <PostCommentForm
          inputRef={inputRef}
          onCancelReply={handleCancelReply}
          onSubmit={handleSubmit}
          replyingToComment={replyingToComment}
          onFocus={() => expandableRef.current?.maximize()}
        />
      }
    >
      <KeyboardAwareFlatList
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        data={state.comments}
        onEndReached={getComments}
        renderItem={({ item: comment }) => (
          <Comment
            firstParent={comment.firstParent}
            replyCount={comment.replyCount}
            key={comment.id}
            id={comment.id}
            body={comment.body}
            style={{ paddingHorizontal: theme.screenMargin }}
            isBeingRepliedTo={state.replyingToCommentId === comment.id}
            createdAt={comment.createdAt}
            likeCount={comment.likeCount}
            onLoadCommentReplies={handleLoadCommentReplies}
            onPressReply={handlePressReply}
            onDeleteComment={handleDeleteComment}
            rootParentId={comment.rootParentId}
            replyPageCount={comment.replyPageCount}
            onReplyPage={comment.onReplyPage}
            onLike={handleCommentLike}
            onUnlike={handleCommentUnlike}
            postedBy={comment.postedBy}
            requesterLiked={comment.requesterLiked}
            isLoadingReplies={comment.isLoadingReplies}
          />
        )}
      />
    </ExpandableModal>
  );
};
