import { Request, RequestHandler } from 'express';
import { ApiError } from '@src/utils/ApiError';
import jwt from 'jsonwebtoken';
import { appConfig } from '@src/utils/config';
import { JWTUserPayload } from '@shared/types/UserJWT';

type UserRolesType = 'admin' | 'moderator' | 'user' | 'any';

const hierarchy: Record<UserRolesType, number> = {
  admin: 0,
  moderator: 1,
  user: 2,
  any: 3,
};

const setReqUser = (req: Request, token: string) => {
  jwt.verify(token, appConfig.get('jwtPrivateKey'), (err, decoded) => {
    if (err) throw new ApiError(400, 'Invalid token');
    req.user = decoded as JWTUserPayload;
  });
};

/**
 * 'any' - process JWT, if present, and save to req.user
 * 'user' - only allow JWT with user role set to user
 * 'moderator' - only allow JWT with user role set to moderator
 * 'admin' - only allow JWT with user role set to admin
 * @param authorizedRole
 * @returns
 */
export const auth = (authorizedRole: UserRolesType): RequestHandler => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') testCall(authorizedRole);

    const token = req.headers['x-auth-token'];

    const isTokenArray = Array.isArray(token);

    if (authorizedRole === 'any' && token && !isTokenArray) {
      setReqUser(req, token);
      return next();
    } else if (authorizedRole === 'any' && !token) {
      return next();
    }

    if (!token || isTokenArray)
      throw new ApiError(
        401,
        `Access denied. An authorization token must be sent.`
      );

    setReqUser(req, token);

    if (
      hierarchy[(req.user as JWTUserPayload).role] > hierarchy[authorizedRole]
    ) {
      throw new ApiError(403, `You do not have permission to do this action`);
    }

    next();
  };
};

/**
 * Express doesn't explicitly call middleware functions, so a test call
 * is needed to verify middleware is being implemented correctly.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export const testCall = (authorizedRole: unknown) => {};
