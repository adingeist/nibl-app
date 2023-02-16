import { DataSource } from 'typeorm';
import rootDir from 'app-root-path';
import { appConfig } from '@src/utils/config';

const db = appConfig.get('db');

export const AppDataSource = new DataSource({
  type: db.type,
  host: db.host,
  extra: { socketPath: `/cloudsql/${db.project}:${db.region}:${db.instance}` },
  username: db.username,
  password: db.password,
  database: db.database,
  entities: [`${rootDir}/src/entities/**/*entity.{js,ts}`],

  synchronize: true,
  logging: false,
});

export const startDb = async () => {
  await AppDataSource.initialize();
};
