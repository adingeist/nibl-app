import { AuthToken } from '@src/entities/AuthToken.entity';
import { User } from '@src/entities/User.entity';
import { validate } from '@src/middleware/validate';
import { AuthTokenRepository } from '@src/repository/AuthToken.repository';
import { UserRepository } from '@src/repository/User.repository';
import { RouteSchemas } from '@shared/schemas/routes';
import {
  IAuth,
  IAuthOTP,
  IAuthOTPRequest,
  ILogout,
} from '@shared/types/routes/auth.controller';
import { ApiError } from '@src/utils/ApiError';
import express from 'express';
import moment from 'moment';
import { auth } from '@src/middleware/auth';
import { ExpoPushTokenRepository } from '@src/repository/ExpoPushToken.repository';

const router = express.Router();

// POST /auth
router.post<IAuth['params'], IAuth['res'], IAuth['body']>(
  `/`,
  validate(RouteSchemas.auth),
  async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    let credential: 'username' | 'email' | 'phone';
    let user: User | null;
    if (username) {
      user = await UserRepository.findOneBy({ username });
      credential = 'username';
    } else if (email) {
      user = await UserRepository.findOneBy({ email });
      credential = 'email';
    } else if (phone) {
      user = await UserRepository.findOneBy({ phone });
      credential = 'phone';
    } else {
      throw new ApiError(400, `A username, email, or phone must be provided`);
    }

    if (!user) {
      throw new ApiError(400, `Invalid ${credential} or password`);
    }

    const passwordIsValid = await user.comparePassword(password);

    if (!passwordIsValid) {
      throw new ApiError(400, `Invalid ${credential} or password.`);
    }

    res.set(`x-auth-token`, user.getJWT()).send({ success: true });
  }
);

export default router;

// DELETE /auth/logout
router.delete<
  ILogout['params'],
  ILogout['res'],
  ILogout['body'],
  ILogout['query']
>(`/logout`, auth('user'), validate(RouteSchemas.logout), async (req, res) => {
  const token = req.body.pushToken;

  await ExpoPushTokenRepository.deleteByToken(token);

  res.status(200).send();
});

// POST /auth/otp
router.post<IAuthOTP['params'], IAuthOTP['res'], IAuthOTP['body']>(
  '/otp',
  validate(RouteSchemas.authOTP),
  async (req, res) => {
    const id = req.body.userId;

    const user = await UserRepository.findOneBy({ id });

    if (!user) {
      throw new ApiError(400, `Invalid pin`);
    }

    const authToken = await AuthTokenRepository.findOne({
      where: { user: { id } },
      order: { createdAt: 'DESC' },
    });

    if (!authToken) {
      throw new ApiError(400, `Invalid pin`);
    }

    if (authToken.attempts >= 3) {
      throw new ApiError(400, 'Please request another pin');
    }

    if (moment(authToken.expiresAt).isBefore(moment())) {
      throw new ApiError(400, 'That pin is expired');
    }

    const isCorrect = await authToken.comparePin(req.body.pin);

    if (isCorrect) {
      await AuthTokenRepository.delete({ id: authToken.id });
      if (authToken.sentToEmail) user.emailIsVerified = true;
      if (authToken.sentToPhone) user.phoneIsVerified = true;
      await UserRepository.save(user);
    } else {
      await AuthTokenRepository.update(authToken.id, {
        attempts: authToken.attempts + 1,
      });
      throw new ApiError(400, `Invalid pin`);
    }

    res.set(`x-auth-token`, user.getJWT()).send({ success: true });
  }
);

// POST /auth/otp-request
router.post<
  IAuthOTPRequest['params'],
  IAuthOTPRequest['res'],
  IAuthOTPRequest['body']
>('/otp-request', validate(RouteSchemas.authOTPRequest), async (req, res) => {
  const email = req.body.email;
  const phone = req.body.phone;

  if (email && phone) {
    throw new ApiError(400, `Only provide email or phone`);
  }

  let user: User | null;
  if (email) {
    user = await UserRepository.findOneBy({ email });
  } else if (phone) {
    user = await UserRepository.findOneBy({ phone });
  } else {
    throw new ApiError(400, `An email or phone must be provided`);
  }

  if (!user) {
    throw new ApiError(404, `An account isn't associated with that credential`);
  }

  let token: AuthToken;
  if (email) {
    token = await user.emailAuthToken();
  } else {
    token = await user.smsAuthToken();
  }
  await AuthTokenRepository.save(token);

  res.send({ userId: user.id });
});
