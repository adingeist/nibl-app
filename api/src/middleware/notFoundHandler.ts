import { ApiError } from '@src/utils/ApiError';
import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = () => {
  throw new ApiError(404, 'Endpoint not found.');
};
