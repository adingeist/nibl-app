import { JWTUserPayload } from '@shared/types/UserJWT';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: JWTUserPayload;
      uploadedKeys?: string[];
    }
  }
}
