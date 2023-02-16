export interface CommentDto {
  id: string;
  onPostId: string;
  postedBy: {
    id: string;
    profileImage?: string;
    username: string;
  };
  rootParentId?: string;
  firstParent?: CommentDto | null;
  body: string;
  likeCount: number;
  replyCount: number;
  requesterLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
