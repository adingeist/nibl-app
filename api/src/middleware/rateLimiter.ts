import { ApiError } from '@src/utils/ApiError';
import { logger } from '@src/start/logger';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const skipTests = () => {
  if (process.env.NODE_ENV === 'test') {
    return true;
  } else return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onLimitReached = (req: Request, res: Response) => {
  logger.warn(
    `${req.ip} has made ${max} requests within the past ${windowMs}ms`
  );
  throw new ApiError(
    429,
    'Please wait some time before sending your next request.'
  );
};

const windowMs = 1 * 60 * 1000; // can request every 1 min
const max = 500; // requests allowed per windowMs

// Applied to all endpoints
export const rateLimiter = rateLimit({
  windowMs,
  max,
  skip: skipTests,
  onLimitReached,
});
