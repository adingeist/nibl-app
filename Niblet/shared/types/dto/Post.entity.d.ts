import { PostedByDtoType } from '@shared/types/dto/PostedByDto';

export type PostDtoType = {
  id: string;
  postedBy: PostedByDtoType;
  caption: string;
  video: string;
  banner: string;
  thumbnail: string;

  likeCount: number;
  commentCount: number;
  requesterLiked: boolean;

  createdAt: string;
  updatedAt: string;
};
