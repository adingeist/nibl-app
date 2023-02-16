import { PostedByDtoType } from '@shared/types/dto/PostedByDto';

export type FollowerDto = {
  id: string;
  followerUser: PostedByDtoType;
  followingUser: PostedByDtoType;
  createdAt: string;
  updatedAt: string;
};
