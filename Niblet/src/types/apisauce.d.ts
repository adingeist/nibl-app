import { ApiResponse } from 'apisauce';
import { AxiosRequestConfig } from 'axios';

export type ApiRoute = {
  params?: unknown;
  body?: unknown;
  query?: unknown;
  res?: unknown;
  attachments?: unknown;
};

type OptionalIfEmptyObj<T> = T extends Record<string, never> ? undefined : T;

type ApiFuncRequest<Payload> = Omit<
  Pick<
    Payload,
    {
      [K in keyof Payload]-?: Payload[K] extends Record<string, never>
        ? never
        : K;
    }[keyof Payload]
  >,
  'res' | 'query'
> & { query?: Record<string, unknown> };

export type ApiFunction<
  Request extends ApiRoute,
  ErrorResponseData = string,
> = (
  req: ApiFuncRequest<Request>,
  config?: AxiosRequestConfig,
) => Promise<ApiResponse<Request['res'], ErrorResponseData>>;
