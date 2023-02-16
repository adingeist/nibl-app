import { authStorage } from '@src/auth/authStorage';
import { create, ApiResponse } from 'apisauce';
import { AxiosRequestConfig } from 'axios';

const apiSauceClient = create({
  baseURL: 'http://192.168.86.26:3000/',
});

type Cli = typeof apiSauceClient;

const methodWithToken = async <T, U = T>(
  method: Cli['get'] | Cli['post'] | Cli['put'] | Cli['delete'],
  url: string,
  data?: unknown,
  axiosConfig?: AxiosRequestConfig,
): Promise<ApiResponse<T, U>> => {
  if (
    axiosConfig?.headers &&
    axiosConfig.headers &&
    axiosConfig.headers['x-auth-token']
  ) {
    return method(url, data, axiosConfig);
  } else {
    const token = await authStorage.getToken();
    return method(url, data, {
      ...axiosConfig,
      headers: { 'x-auth-token': token, ...axiosConfig?.headers },
    });
  }
};

const getWithAuthToken = <T, U = T>(
  url: string,
  data?: unknown,
  axiosConfig?: AxiosRequestConfig,
) => methodWithToken<T, U>(apiSauceClient.get, url, data, axiosConfig);

const postWithAuthToken = <T, U = T>(
  url: string,
  data?: unknown,
  axiosConfig?: AxiosRequestConfig,
) => methodWithToken<T, U>(apiSauceClient.post, url, data, axiosConfig);

const putWithAuthToken = <T, U = T>(
  url: string,
  data?: unknown,
  axiosConfig?: AxiosRequestConfig,
) => methodWithToken<T, U>(apiSauceClient.put, url, data, axiosConfig);

const deleteWithAuthToken = <T, U = T>(
  url: string,
  data?: unknown,
  axiosConfig?: AxiosRequestConfig,
) => methodWithToken<T, U>(apiSauceClient.delete, url, data, axiosConfig);

export const client = {
  getWithAuthToken,
  deleteWithAuthToken,
  postWithAuthToken,
  putWithAuthToken,
  ...apiSauceClient,
};
