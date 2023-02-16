import { ApiFunction } from '@src/types/apisauce';
import { client } from '@src/api/connection';
import {
  IAuth,
  IAuthOTP,
  IAuthOTPRequest,
  ILogout,
} from '@shared/types/routes/auth.controller';

const login: ApiFunction<IAuth> = (req, config) =>
  client.post('/api/v1/auth', req.body, config);

const logout: ApiFunction<ILogout> = (req, config) =>
  client.deleteWithAuthToken(
    `/api/v1/auth/logout`,
    {},
    { data: req.body, ...config }
  );

const requestOTP: ApiFunction<IAuthOTPRequest> = (req, config) =>
  client.post('/api/v1/auth/otp-request', req.body, config);

const submitOTP: ApiFunction<IAuthOTP> = (req, config) =>
  client.post('/api/v1/auth/otp', req.body, config);

export const authApi = {
  login,
  logout,
  requestOTP,
  submitOTP,
};
