import { appConfig } from '@src/utils/config';
import { Bucket, Storage } from '@google-cloud/storage';
import { logger } from '@src/start/logger';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

const gcpConfig = appConfig.get('gcp');

class StorageService {
  private bucket: Bucket;

  constructor() {
    const keyFilename = path.resolve('temp/gcpKeyFile.json');
    if (process.env.NODE_ENV !== 'test')
      fs.writeFileSync(keyFilename, gcpConfig.keyFile, {
        encoding: 'base64',
      });
    const storageClient = new Storage({
      projectId: gcpConfig.projectId,
      keyFilename,
    });
    // ensure application is logged in
    storageClient.getServiceAccount((err) => {
      if (err) throw err;
      logger.info(`Connected to GCP storage`);
    });
    this.bucket = storageClient.bucket(gcpConfig.bucket);
  }

  /**
   * Uploads a file to and deletes it on disk.
   */
  async uploadFile(req: Request, filePath: string) {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    await this.bucket.upload(filePath, {
      destination: fileName,
    });

    if (!req.uploadedKeys) req.uploadedKeys = [];
    req.uploadedKeys.push(fileName);

    return fileName;
  }

  /**
   * Uploads files to storage and deletes them on disk.
   */
  uploadFiles(req: Request, ...filePaths: string[]) {
    return Promise.all(filePaths.map((path) => this.uploadFile(req, path)));
  }

  /**
   * Deletes an object from the bucket.
   * @param keys Keys of images to delete.
   */
  deleteFile(key: string) {
    this.bucket.file(key).delete();
  }

  /**
   * Deletes objects from the bucket.
   * @param keys Keys of images to delete.
   */
  deleteFiles = (...keys: string[]) => {
    Promise.all(keys.map((key) => this.deleteFile(key)));
  };

  /**
   * Transform a file key to the uri of it in the storage service
   * @param fileKey - Key of the file in the bucket to be fetched
   */
  keyToUri = (fileKey: string) => {
    return `https://${this.bucket.name}.storage.googleapis.com/${fileKey}`;
  };
}

export const storageService = new StorageService();
