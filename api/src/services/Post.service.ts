import { logger } from '@src/start/logger';
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '@src/utils/config';
import { ApiError } from '@src/utils/ApiError';

class PostService {
  async combineVideos(filePaths: string[]) {
    const fileUUID = uuidv4();
    const combinedVideoPath = path.resolve(`temp/uploads/${fileUUID}.mp4`);

    await new Promise<void>((resolve, reject) => {
      const mergedVideo = ffmpeg();

      filePaths.forEach((filePath) => {
        mergedVideo.addInput(filePath);
      });

      mergedVideo
        .on('progress', (progress) => {
          logger.verbose(
            `[ffmpeg] [combine videos] ${JSON.stringify(progress)}`
          );
        })
        .on('error', function (err) {
          logger.error('[ffmpeg] [combine videos] Error ' + err.message);
          reject(err.message);
        })
        .on('end', function () {
          logger.verbose('[ffmpeg] [combine videos] Finished!');
          resolve();
        })
        .mergeToFile(combinedVideoPath, { end: true });
    });

    return combinedVideoPath;
  }

  async validateVideo(videoPath: string) {
    const videoData = (
      await ffprobe(videoPath, {
        path: ffprobeStatic.path,
      })
    ).streams.find((stream) => {
      const okVideoCodecType = appConfig
        .get('okVideoTypes')
        .map((type) => type.substring(6));

      return (
        stream.codec_name !== undefined &&
        okVideoCodecType.includes(stream.codec_name)
      );
    });

    if (!videoData) throw new ApiError(400, 'A video must be provided');

    if (!videoData.duration) throw new ApiError(400, 'Video is invalid');

    if (videoData.duration < 1)
      throw new ApiError(400, 'Video must be longer than 1 second');

    if (videoData.duration > 60)
      throw new ApiError(400, 'Video must be shorter than 60 seconds');
  }

  async processVideo(notProcessedPath: string) {
    const fileUUID = uuidv4();
    const finalVideoPath = path.resolve(`temp/uploads/${fileUUID}.mp4`);

    const bannerName = `${fileUUID}-banner.jpg`;
    const bannerPath = path.resolve(`temp/uploads/${bannerName}`);

    const thumbName = `${fileUUID}-thumb.jpg`;
    const thumbPath = path.resolve(`temp/uploads/${thumbName}`);

    await Promise.all([
      // Process and save the video asynchronously
      new Promise<void>((resolve, reject) => {
        ffmpeg(notProcessedPath)
          .setSize('1080x?')
          .toFormat('mp4')
          .saveToFile(finalVideoPath)
          .on('progress', (progress) => {
            logger.verbose(`[ffmpeg] [video] ${JSON.stringify(progress)}`);
          })
          .on('error', (err) => this.handleUploadError(err, reject))
          .on('end', () => {
            logger.verbose('[ffmpeg] [video] Finished writing final video.');
            resolve();
          });
      }),
      // Process and save a banner of the video asynchronously
      new Promise<void>((resolve, reject) => {
        ffmpeg(notProcessedPath)
          .screenshot({
            folder: path.resolve('temp/uploads'),
            filename: bannerName,
            timestamps: [0],
            size: '1080x?',
          })
          .on('progress', (progress) => {
            logger.verbose(`[ffmpeg] [banner] ${JSON.stringify(progress)}`);
          })
          .on('error', (err) => this.handleUploadError(err, reject))
          .on('end', () => {
            logger.verbose(
              '[ffmpeg] [banner] Finished extracting video banner.'
            );
            resolve();
          });
      }),
      // Create a video thumbnail
      new Promise<void>((resolve, reject) => {
        ffmpeg(notProcessedPath)
          .screenshot({
            folder: path.resolve('temp/uploads'),
            filename: thumbName,
            timestamps: [0],
            size: '108x192',
          })
          .on('progress', (progress) => {
            logger.verbose(`[ffmpeg] [thumbnail] ${JSON.stringify(progress)}`);
          })
          .on('error', (err) => this.handleUploadError(err, reject))
          .on('end', () => {
            logger.verbose(
              '[ffmpeg] [thumbnail] Finished extracting video thumbnail.'
            );
            resolve();
          });
      }),
    ]);

    return { bannerPath, thumbPath, videoPath: finalVideoPath };
  }

  private handleUploadError(err: Error, reject: (err: Error) => void) {
    reject(err);
  }
}

export const postService = new PostService();
