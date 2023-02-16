/* eslint-disable @typescript-eslint/no-empty-function */
import type { PostCardProps } from '@src/components/post/PostCard';
import { createContext, useContext } from 'react';

type PostContext = {
  onLike: PostCardProps['onLike'];
  onUnlike: PostCardProps['onUnlike'];
  onDelete: PostCardProps['onDelete'];
} & PostCardProps['post'];

const PostContext = createContext<PostContext>({
  onLike: () => {},
  onUnlike: () => {},
  onDelete: () => {},
  nibCount: 0,
  id: '',
  title: '',
  post: {
    id: '',
    requesterLiked: false,
    postedBy: {
      id: '',
      username: '',
      profileImage: '',
      requesterIsFollowing: false,
    },
    caption: '',
    video: 'any',
    banner: 'any',
    thumbnail: 'any',
    likeCount: 0,
    commentCount: 0,
    createdAt: '',
    updatedAt: '',
  },
  minuteDuration: 90,
  recipeNote: '',
  createdAt: '',
  updatedAt: '',
  postType: 'recipe',
});

export const PostContextProvider = PostContext.Provider;

export const usePostContext = () => useContext(PostContext);
