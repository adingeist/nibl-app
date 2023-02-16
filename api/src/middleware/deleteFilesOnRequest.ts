import { logger } from '@src/start/logger';
import { Request } from 'express';
import fs from 'fs/promises';

export const deleteFilesOnRequest = async (req: Request) => {
  try {
    if (req.file) {
      await fs.unlink(req.file.path);
    } else if (Array.isArray(req.files)) {
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
    } else if (req.files) {
      if (typeof req.files === 'object') {
        Object.keys(req.files).forEach(async (fieldName) => {
          const fieldFiles = (
            req.files as Record<string, Express.Multer.File[]>
          )[fieldName];

          for (const file of fieldFiles) {
            await fs.unlink(file.path);
          }
        });
      }
    }
  } catch (err) {
    logger.error(
      `Files already cleared. deleteFilesOnRequest() is called more than once. Error: ${err}`
    );
  }
};
