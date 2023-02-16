import { FollowerDto } from '@shared/types/dto/Follower.entity';
import { PaginationQuery, PaginationRes } from '@shared/types/dto/Pagination';
import { PostedByDtoType } from '@shared/types/dto/PostedByDto';

export type IFollowUser = {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: FollowerDto;
};

export type IUnfollowUser = {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: Record<string, never>;
};

export type IGetFollowers = {
  params: { id: string };
  body: Record<string, never>;
  query: PaginationQuery;
  res: { followers: PostedByDtoType[] } & PaginationRes;
};

export type IGetFollowing = {
  params: { id: string };
  body: Record<string, never>;
  query: PaginationQuery;
  res: { following: PostedByDtoType[] } & PaginationRes;
};
