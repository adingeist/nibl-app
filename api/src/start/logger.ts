import { appConfig } from '@src/utils/config';
import {
  format,
  transports,
  createLogger,
  addColors,
  Logger,
} from 'winston';

const logConfig = appConfig.get('logger');

// import winstonMongoDb from 'winston-mongodb';
// require('winston-mongodb');
export let logger = {} as Logger;

import _ from 'lodash';

export const startLogger = () => {
  const nibletLevels = {
    levels: {
      emerg: 0,
      error: 1,
      warn: 2,
      info: 3,
      http: 4,
      verbose: 5,
      debug: 6,
    },
    colors: {
      emerg: 'bold white redBG',
      error: 'bold red',
      warn: 'yellow',
      info: 'cyan',
      http: 'magenta',
      verbose: 'dim cyan',
      debug: 'dim cyan',
    },
  };

  const getEnvLoggingLevel = () => {
    const level: string = logConfig.level;
    return level;
  };

  // 'any' is needed in this context because 'instanceof' requires left-side
  // to be of type 'any'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumerateErrorFormat = format((info: any) => {
    if (info.message instanceof Error) {
      info.message = Object.assign(
        {
          message: info.message.message,
          stack: info.message.stack,
        },
        info.message
      );
    }

    if (info instanceof Error) {
      return Object.assign(
        {
          message: info.message,
          stack: info.stack,
        },
        info
      );
    }

    return info;
  });

  addColors(nibletLevels.colors);

  const nibletTransports: (
    | transports.ConsoleTransportInstance
    | transports.FileTransportInstance
  )[] =
    // | winstonMongoDb.MongoDBTransportInstance
    [
      new transports.Console({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          format.printf((info) => {
            if (info.private) return '';
            if (info.stack)
              return `${
                info.timestamp
              } ${info.level.toUpperCase()}: ${info.message}\n\n${
                info.stack
              }\n\n`;
            else
              return `${
                info.timestamp
              } ${info.level.toUpperCase()}: ${info.message}`;
          }),
          format.colorize({ all: true })
        ),
      }),
      new transports.File({
        filename: 'src/logs/error.log',
        level: 'error',
      }),
      new transports.File({
        filename: 'src/logs/combined.log',
      }),
    ];

  // Do not log to database if in test environment
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    nibletTransports
      .push
      // new transports.MongoDB({
      // db: logConfig.db,
      // level: 'error',
      // leaveConnectionOpen: false,
      // })
      ();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addMeta = format((info: any) => {
    const noLevelOrMessage = { ...info };
    delete noLevelOrMessage.level;
    delete noLevelOrMessage.message;
    delete noLevelOrMessage.timestamp;
    if (!_.isEmpty(noLevelOrMessage))
      info.metadata = noLevelOrMessage;
    return info;
  });

  logger = createLogger({
    level: getEnvLoggingLevel(),
    levels: nibletLevels.levels,
    format: format.combine(
      format.timestamp(),
      enumerateErrorFormat(),
      addMeta(),
      format.json()
    ),
    transports: nibletTransports,
  });

  process.on('unhandledRejection', (err) => {
    logger.error(err);
    process.exit();
  });

  process.on('uncaughtException', (err) => {
    logger.error(err);
    process.exit();
  });
};
