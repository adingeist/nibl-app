import { appConfig } from '@src/utils/config';
import e from 'express';
import multer from 'multer';

type ImageFilterFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: e.Request<any, any, any, any, Record<string, any>>,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => void;

const filterImages: ImageFilterFn = (req, file, cb) => {
  if (appConfig.get('okImageTypes').includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};

const filterVideos: ImageFilterFn = (req, file, cb) => {
  if (appConfig.get('okVideoTypes').includes(file.mimetype)) cb(null, true);
  else cb(null, false);
};

const filterImagesAndVideos: ImageFilterFn = (req, file, cb) => {
  if (
    appConfig.get('okImageTypes').includes(file.mimetype) ||
    appConfig.get('okVideoTypes').includes(file.mimetype)
  )
    cb(null, true);
  else cb(null, false);
};

export const FileFilters = {
  images: filterImages,
  videos: filterVideos,
  imagesAndVideos: filterImagesAndVideos,
};

export const appUploadFile = (options: multer.Options) =>
  multer({
    storage: multer.diskStorage({
      destination: 'temp/uploads',
    }),

    fileFilter: options.fileFilter,
    limits: {
      fieldNameSize: 100, // bytes
      fields: 100, // max non-file fields allowed
      fieldSize: 1 * 1024 * 1024, // 1 MB
      files: 2, // file fields
      fileSize: 5 * 1024 * 1024, // 5 MB
      parts: 50, // fields + files
      ...options.limits,
    },
  });
