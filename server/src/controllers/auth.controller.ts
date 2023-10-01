import { NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@app/services';
import {
  IAppRequest,
  IRefreshToken,
  ISignIn,
  ISignInResponse,
  ISignUp,
  ISignUpResponse,
  TResponse,
} from '@shared/interfaces';
import { AUTH_COOKIE_NAME, authCookieConfig } from '@app/configs';
import { HttpStatusCode } from '@shared/enums';

export class AuthController {
  private service = Container.get(AuthService);

  public signUp = async (
    { body }: IAppRequest<ISignUp>,
    res: TResponse<ISignUpResponse>,
    next: NextFunction,
  ) => {
    try {
      const { user, refreshToken, authToken } = await this.service.signUp(body);

      res
        .status(HttpStatusCode.CREATED)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            user,
            refreshToken,
          },
          status: 'success',
          message: 'signed up successfully',
          statusCode: HttpStatusCode.CREATED,
        });
    } catch (err) {
      next(err);
    }
  };

  public signIn = async (
    { body }: IAppRequest<ISignIn>,
    res: TResponse<ISignInResponse>,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken, authToken } = await this.service.signIn(body);

      res
        .status(HttpStatusCode.OK)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            refreshToken,
          },
          status: 'success',
          message: 'signed in successfully',
          statusCode: HttpStatusCode.OK,
        });
    } catch (err) {
      next(err);
    }
  };

  public refreshToken = async (
    { body }: IAppRequest<IRefreshToken>,
    res: TResponse<ISignInResponse>,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken, authToken } = await this.service.refreshToken(
        body.refreshToken,
      );

      res
        .status(HttpStatusCode.OK)
        .cookie(AUTH_COOKIE_NAME, authToken, authCookieConfig)
        .json({
          data: {
            refreshToken,
          },
          status: 'success',
          message: 'token refreshed successfully',
          statusCode: HttpStatusCode.OK,
        });
    } catch (err) {
      next(err);
    }
  };
}
