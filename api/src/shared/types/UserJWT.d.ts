export type UserRolesStringType = 'admin' | 'moderator' | 'user';

export type JWTUserPayload = {
  id: string;
  isVerified: boolean;
  profileImage: string;
  role: UserRolesStringType;
  username: string;
};
