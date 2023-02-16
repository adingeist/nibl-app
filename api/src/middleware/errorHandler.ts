/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiError } from '@src/utils/ApiError';
import { deleteFilesOnRequest } from '@src/middleware/deleteFilesOnRequest';
import { ErrorRequestHandler } from 'express';
import { logger } from '@src/start/logger';
import { storageService } from '@src/services/Storage.service';

// Error handler must have all 4 parameters to work with Express properly
export const errorHandler: ErrorRequestHandler = async (
  err,
  req,
  res,
  next
) => {
  // Delete local files on server
  await deleteFilesOnRequest(req);

  // Delete persisted files created during this failed request
  if (req.uploadedKeys) storageService.deleteFiles(...req.uploadedKeys);

  if (err instanceof ApiError) {
    if (err.status >= 500) logger.error(err);
    return res.status(err.status).send(err.message);
  }

  logger.error(err);

  res.status(500).send('Something went wrong.');
};
