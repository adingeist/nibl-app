/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ApiError } from '@src/utils/ApiError';

export const jsonErrorHandler: ErrorRequestHandler = (
  _err,
  _req,
  res,
  next
) => {
  throw new ApiError(400, 'Could not parse JSON in request body.');
};
