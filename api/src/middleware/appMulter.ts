import multer from 'multer';

type appMulterParams = {
  allowedMimetypes?: string[];
  limitOverrides?: multer.Options['limits'];
};

export const appMulter = ({
  allowedMimetypes,
  limitOverrides,
}: appMulterParams) =>
  multer({
    storage: multer.diskStorage({
      destination: 'temp/uploads',
    }),
    fileFilter: (req, file, cb) => {
      if (!allowedMimetypes || allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    limits: {
      fieldNameSize: 100, // bytes
      fields: 100, // max non-file fields allowed
      fieldSize: 1 * 1024 * 1024, // 1 MB
      files: 40, // file fields
      fileSize: 50 * 1024 * 1024, // 50 MB
      parts: 100, // fields + files
      ...limitOverrides,
    },
  });
