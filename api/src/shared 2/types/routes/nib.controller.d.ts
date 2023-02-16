import { NibDto } from '@shared/types/dto/Nib.entity';

export interface IPostNib {
  params: Record<string, never>;
  body: { caption?: string; recipeId: string };
  query: Record<string, never>;
  attachments: { video: string[] };
  res: NibDto;
}
