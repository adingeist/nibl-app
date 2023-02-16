import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { PaginationQuery, PaginationRes } from '@shared/types/dto/Pagination';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';

export type FeedRecipeOrNibDtoType = FeedRecipeDtoType | FeedNibDtoType;

export type IGetFeed = {
  params: Record<string, never>;
  body: Record<string, never>;
  query: Record<string, never>;
  res: { posts: FeedRecipeDtoType[] };
};

export type IGetFollowingFeed = {
  params: Record<string, never>;
  body: Record<string, never>;
  query: PaginationQuery;
  res: { posts: FeedRecipeOrNibDtoType[] } & PaginationRes;
};
