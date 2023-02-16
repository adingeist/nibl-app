import { CommentDto } from '@shared/types/dto/Comment.entity';
import { PaginationQuery, PaginationRes } from '@shared/types/dto/Pagination';

export interface IPostComment {
  params: { postId: string };
  res: CommentDto;
  body: {
    body: string;
    rootParentId?: string;
    firstParentId?: string;
  };
  query: Record<string, never>;
}

export interface IGetComments {
  params: { postId: string };
  body: Record<string, never>;
  res: PaginationRes & { comments: CommentDto[] };
  query: PaginationQuery;
}

export interface IGetCommentReplies {
  params: {
    postId: string;
    commentId: string;
  };
  body: Record<string, never>;
  res: PaginationRes & { replies: CommentDto[] };
  query: PaginationQuery;
}

export interface IDeleteComment {
  params: { commentId: string };
  res: Record<string, never>;
  body: Record<string, never>;
  query: Record<string, never>;
}
