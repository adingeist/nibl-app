/* eslint-disable @typescript-eslint/no-var-requires */
require('./start/env').default();
require('express-async-errors');
import appRootPath from 'app-root-path';
import 'source-map-support/register';
import { addAlias } from 'module-alias';
addAlias('@src', `${appRootPath}/src`);
addAlias('@shared', `${appRootPath}/src/shared`);

import startTempDir from '@src/start/tempDir';
startTempDir();

import { startConfig } from '@src/start/config';
import { logger, startLogger } from '@src/start/logger';
import { startDb } from '@src/start/db';
import express from 'express';

const app = express();

startConfig();
startLogger();
import { startPipeline } from '@src/start/routes';

startPipeline(app);
if (process.env.NODE_ENV !== 'test')
  startDb().then(async () => {
    logger.info('Connected to database');
    app.listen(3000, () => {
      logger.info('Server is listening on port 3000');
    });
  });

export default app;
