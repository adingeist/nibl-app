import express, { Router, RouterOptions } from 'express';

type AppRouterVerbType = <
  HandlerTypes extends {
    params: unknown;
    res: unknown;
    body: unknown;
    query: unknown;
  },
>(
  path: string,
  ...handlers: express.RequestHandler<
    HandlerTypes['params'],
    HandlerTypes['res'],
    HandlerTypes['body'],
    HandlerTypes['query'],
    Record<string, unknown>
  >[]
) => express.Router;

type AppRouterReturnType =
  | Omit<Router, 'get' | 'post' | 'put' | 'delete'> & {
      get: AppRouterVerbType;
      post: AppRouterVerbType;
      put: AppRouterVerbType;
      delete: AppRouterVerbType;
    };

export const getAppRouter = (options?: RouterOptions): AppRouterReturnType => {
  return express.Router(options) as AppRouterReturnType;
};
