import { PostLikeDto } from '@shared/types/dto/PostLikeDto.entity';
import { CommentLikeDto } from '@shared/types/dto/CommentLikeDto.entity';

export interface ILikePost {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: PostLikeDto;
}

export interface IUnlikePost {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: Record<string, never>;
}

export interface ILikeComment {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: CommentLikeDto;
}

export interface IUnlikeComment {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: Record<string, never>;
}
