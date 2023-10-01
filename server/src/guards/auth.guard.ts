import { NextFunction, Response } from 'express';
import { AUTH_COOKIE_NAME, JWT_SECRET_KEY } from '@app/configs';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';
import { UserModel } from '@app/models';
import {
  IAppRequest,
  IProtectRequest,
  IUser,
  TResponse,
  TUserRole,
} from '@shared/interfaces';
import { verifyToken } from '@shared/utils';
import { NON_EDITABLE_USER_FIELDS } from '@shared/constants';

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

  public static protectUpdateUser = (
    { params, user, body }: IAppRequest<IUser, { id: string }>,
    _res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    if (user.role !== 'admin' && user.id !== params.id) {
      return next(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'You can not edit this user.',
        ),
      );
    }

    if (user.role !== 'admin' && body.role) {
      return next(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'You can not edit user role',
        ),
      );
    }

    const bodyKeys = Object.keys(body);

    const hasRestrictedKeys = bodyKeys.some(key =>
      NON_EDITABLE_USER_FIELDS.includes(key),
    );

    if (user.role !== 'admin' && hasRestrictedKeys) {
      return next(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'You can not edit this field.',
        ),
      );
    }

    next();
  };

  public static isSameUser = (
    { params, user }: IAppRequest<IUser, { id: string }>,
    _res: TResponse<IUser>,
    next: NextFunction,
  ) => {
    if (user.role !== 'admin' && user.id !== params.id) {
      return next(
        new HttpException(
          HttpStatusCode.FORBIDDEN,
          'You are not permitted to do this',
        ),
      );
    }

    next();
  };
}
