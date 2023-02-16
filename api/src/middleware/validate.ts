import { ApiError } from '@src/utils/ApiError';
import { RequestHandler } from 'express';
import { ValidationObject } from '@shared/schemas/util.joi';
import * as Yup from 'yup';

export const validate = <ReqParams, ResBody, ReqBody, ReqQuery>(
  schemaObj: ValidationObject,
): RequestHandler<
  ReqParams,
  ResBody,
  ReqBody,
  ReqQuery,
  Record<string | number | symbol, unknown>
> => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
      testCall(schemaObj);
    }

    const schema = Yup.object({
      body: schemaObj.body || Yup.object(),
      query: schemaObj.query || Yup.object(),
      params: schemaObj.params || Yup.object(),
    });

    try {
      await schema.validate(req);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        throw new ApiError(400, error.message);
      }
      throw error;
    }

    next();
  };
};

/**
 * Express doesn't explicitly call middleware functions, so a test call
 * is needed to verify middleware is being implemented correctly.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
export const testCall = (schemaObj: unknown) => {};
