import { NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@app/services';
import {
  ICreateRequest,
  ISignUp,
  ISignUpResponse,
  TResponse,
} from '@shared/interfaces';
import { authCookieConfig } from '@app/configs';

export class AuthController {
  private service = Container.get(AuthService);

  public signUp = async (
    { body }: ICreateRequest<ISignUp>,
    res: TResponse<ISignUpResponse>,
    next: NextFunction,
  ) => {
    try {
      const { user, refreshToken, authToken } = await this.service.signUp(body);

      res.status(201).cookie('ns-AuthToken', authToken, authCookieConfig).json({
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
}
