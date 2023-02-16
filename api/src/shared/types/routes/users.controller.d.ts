import { UserRolesStringType } from '@shared/types/UserJWT';
import { FeedRecipeDtoType } from '@shared/types/dto/Recipe.entity';
import { PaginationRes } from '@shared/types/dto/Pagination';
import { FeedNibDtoType } from '@shared/types/dto/Nib.entity';

export interface IGetUser {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: {
    id: string;
    username: string;
    birthday?: string;
    role: UserRolesStringType;
    profileImageKey?: string;
    isVerified: boolean;
    emailIsVerified: boolean;
    phoneIsVerified: boolean;
    updatedAt: string;
    createdAt: string;
    bio?: string;
    link?: string;
  };
}

export interface IGetUserProfile {
  params: { username: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: {
    id: string;
    username: string;
    recipeCount: number;
    nibCount: number;
    followersCount: number;
    likesCount: number;
    profileImage?: string;
    isVerified: boolean;
    bio?: string;
    link?: string;
    updatedAt: string;
    createdAt: string;
  };
}

export interface IGetUserRecipes {
  params: { username: string };
  body: Record<string, never>;
  query: { page?: number };
  res: { recipes: FeedRecipeDtoType[] } & PaginationRes;
}

export interface IGetUserNibs {
  params: { username: string };
  body: Record<string, never>;
  query: { page?: number };
  res: { nibs: FeedNibDtoType[] } & PaginationRes;
}

export interface IGetUserEmail {
  params: Record<string, never>;
  body: Record<string, never>;
  query: Record<string, never>;
  res: { email: string | null; emailIsVerified: boolean };
}

export interface IGetUserPhone {
  params: Record<string, never>;
  body: Record<string, never>;
  query: Record<string, never>;
  res: { phone: string | null; phoneIsVerified: boolean };
}

export interface IPostUser {
  params: Record<string, never>;
  body: {
    username: string;
    email: string | null;
    phone: string | null;
    password: string;
  };
  query: Record<string, never>;
  res: {
    id: string;
    username: string;
    birthday?: string;
    role: UserRolesStringType;
    profileImageKey: string | null;
    isVerified: boolean;
    emailIsVerified: boolean;
    phoneIsVerified: boolean;
    updatedAt: string;
    createdAt: string;
    bio?: string;
    link?: string;
  };
}

export interface IUpdateUser {
  params: { id: string };
  body: {
    email?: string;
    phone?: string;
    link?: string;
    bio?: string;
    birthday?: string;
    username?: string;
    password?: string;
  };
  query: Record<string, never>;
  res: {
    id: string;
    username: string;
    birthday?: string;
    role: UserRolesStringType;
    profileImageKey: string | null;
    isVerified: boolean;
    emailIsVerified: boolean;
    phoneIsVerified: boolean;
    updatedAt: string;
    createdAt: string;
    bio?: string;
    link?: string;
  };
  attachments: {
    profilePicture?: {
      name: string;
      uri: string;
      type: string;
    };
  };
}

export interface IDeleteUser {
  params: { id: string };
  body: Record<string, never>;
  query: Record<string, never>;
  res: Record<string, never>;
}
