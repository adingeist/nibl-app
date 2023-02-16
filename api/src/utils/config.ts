import { IConfig } from '@src/../config/config';
import configModule from 'config';

const get = <T extends keyof IConfig>(property: T) =>
  configModule.get<IConfig[T]>(property);

const okVideoCodecType = get('okVideoTypes').map((type) => type.substring(6));

export const appConfig = {
  ...configModule,
  okVideoCodecType,
  get,
};
