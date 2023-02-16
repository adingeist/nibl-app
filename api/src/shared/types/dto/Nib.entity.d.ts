import { BaseFeedDto } from '@shared/types/dto/FeedDto';
import { PostDtoType } from '@shared/types/dto/Post.entity';
import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';

interface BaseNibDto {
  id: string;
  post: PostDtoType;
  recipe: FeedRecipeDtoType;
  createdAt: string;
  updatedAt: string;
}

export type NibDto = BaseNibDto;

export interface FeedNibDtoType extends BaseNibDto, BaseFeedDto {
  postType: 'nib';
}
