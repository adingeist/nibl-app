/* eslint-disable @typescript-eslint/no-var-requires */
import type { SuperTest, Test } from 'supertest';
import type { Express } from 'express';
import * as Typeorm from 'typeorm';
import rootDir from 'app-root-path';

export const startApp = () => {
  const testDataSource = new Typeorm.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'test',
    database: 'test',
    entities: [`${rootDir}/src/entities/**/*entity.{js,ts}`],

    synchronize: true,
  });

  jest.spyOn(Typeorm, 'DataSource').mockReturnValueOnce(testDataSource);

  beforeAll(async () => {
    const { AppDataSource } = require('@src/start/db') as {
      AppDataSource: Typeorm.DataSource;
    };
    await AppDataSource.initialize();
  });

  const app: Express = require('@src/server').default;
  const supertest: (app: Express) => SuperTest<Test> = require('supertest');

  const request = supertest(app);
  const server = app.listen();

  afterAll(async () => {
    const { AppDataSource } = require('@src/start/db') as {
      AppDataSource: Typeorm.DataSource;
    };
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
    await server.close();
  });

  return request;
};
