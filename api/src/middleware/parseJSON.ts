import { RequestHandler } from 'express';

export const parseJSON: RequestHandler = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') testCall();

  Object.entries(req.body).forEach(([key, value]) => {
    try {
      req.body[key] = JSON.parse(value as string);
      // eslint-disable-next-line no-empty
    } catch (err) {}
  });
  next();
};

/**
 * Express doesn't explicitly call middleware functions, so a test call
 * is needed to verify middleware is being implemented correctly.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const testCall = () => {};
