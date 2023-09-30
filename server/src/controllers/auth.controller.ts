import { NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@app/services';
import {
  ICreateRequest,
  IRefreshToken,
  ISignIn,
  ISignInResponse,
  ISignUp,
  ISignUpResponse,
  TResponse,
} from '@shared/interfaces';
import { AUTH_COOKIE_NAME, authCookieConfig } from '@app/configs';

export class AuthController {
  private service = Container.get(AuthService);

  public signUp = async (
    { body }: ICreateRequest<ISignUp>,
    res: TResponse<ISignUpResponse>,
    next: NextFunction,
  ) => {
    try {
      const { user, refreshToken, authToken } = await this.service.signUp(body);

      res
        .status(201)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            user,
            refreshToken,
          },
          status: 'success',
          message: 'signed up successfully',
        });
    } catch (err) {
      next(err);
    }
  };

  public signIn = async (
    { body }: ICreateRequest<ISignIn>,
    res: TResponse<ISignInResponse>,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken, authToken } = await this.service.signIn(body);

      res
        .status(200)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            refreshToken,
          },
          status: 'success',
          message: 'signed in successfully',
        });
    } catch (err) {
      next(err);
    }
  };

  public refreshToken = async (
    { body }: ICreateRequest<IRefreshToken>,
    res: TResponse<ISignInResponse>,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken, authToken } = await this.service.refreshToken(
        body.refreshToken,
      );

      res
        .status(200)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            refreshToken,
          },
          status: 'success',
          message: 'token refreshed successfully',
        });
    } catch (err) {
      next(err);
    }
  };
}
