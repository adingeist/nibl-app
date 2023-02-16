import morgan from 'morgan';
import split from 'split';
import { IncomingMessage } from 'http';
import { JWTUserPayload } from '@shared/types/UserJWT';
import { logger } from '@src/start/logger';
import jwt from 'jsonwebtoken';

export const setRemoteUser = (req: IncomingMessage) => {
  if (!req.headers['x-auth-token']) return '-';
  const token = jwt.decode(
    req.headers['x-auth-token'] as string
  ) as JWTUserPayload | null;
  if (!token) return '-';
  if (!token.id) return '-';
  return token.id;
};

// Utilizes this odd looking callback to be spied on
morgan.token('remote-user', (req) => setRemoteUser(req));

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const winstonStream = split().on('data', function (info: string) {
  logger.http(info);
});

// Build the morgan middleware
export const httpLogger = morgan(
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  { stream: winstonStream }
);
