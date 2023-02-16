import { client } from '@src/api/connection';

export const keyToUri = (imageKey: string) =>
  `${client.getBaseURL()}api/v1/images/${imageKey}`;
