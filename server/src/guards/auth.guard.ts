import { NextFunction, Response } from 'express';
import { AUTH_COOKIE_NAME, JWT_SECRET_KEY } from '@app/configs';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';
import { UserModel } from '@app/models';
import { IProtectRequest, TUserRole } from '@shared/interfaces';
import { verifyToken } from '@shared/utils';

export class AuthGuard {
  public static protect = async (
    req: IProtectRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    const token = req.cookies ? req.cookies[AUTH_COOKIE_NAME] : null;

    if (!token) {
      return next(
        new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          'You are not logged in. Please log in',
        ),
      );
    }

    try {
      const { id, iat } = await verifyToken(token, JWT_SECRET_KEY);

      const user = await UserModel.findById(id);

      if (!user) {
        return next(
          new HttpException(
            HttpStatusCode.UNAUTHORIZED,
            'Authed user does not exist',
          ),
        );
      }

      const passwordChanged = user.changedPasswordAfter(iat);

      if (passwordChanged) {
        return next(
          new HttpException(
            HttpStatusCode.UNAUTHORIZED,
            'Password was changed after last login. Log in again',
          ),
        );
      }

      req.user = {
        id: user.id,
        role: user.role,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  public static restrict =
    (roles: TUserRole[]) =>
    (
      { user: { role } }: IProtectRequest,
      _res: Response,
      next: NextFunction,
    ) => {
      const granted = roles.includes(role);

      if (!granted) {
        return next(
          new HttpException(
            HttpStatusCode.FORBIDDEN,
            'You are not authorized to do that',
          ),
        );
      }

      next();
    };
}
