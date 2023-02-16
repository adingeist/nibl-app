import * as Yup from 'yup';
import { validate as validateUuid } from 'uuid';

export type ValidationObject = {
  params?: Yup.AnySchema;
  body?: Yup.AnySchema;
  query?: Yup.AnySchema;
};

export type RouteSchemas = Record<string, ValidationObject>;

export const yupObjectId = Yup.string().test(
  'objectId',
  'Invalid ID',
  (value) => (value ? validateUuid(value) : true),
);

export const yupExpoPushToken = Yup.string();
