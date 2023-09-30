import { Container, Service } from 'typedi';
import {
  IAuthWithoutUser,
  IAuthWithUser,
  ISignIn,
  ISignUp,
} from '@shared/interfaces';
import { UserModel } from '@app/models';
import { HttpException } from '@app/exceptions';
import { JWT_REFRESH_SECRET } from '@app/configs';
import { HttpStatusCode } from '@shared/enums';
import { AuthUtils, verifyToken } from '@shared/utils';
import { EmailService } from './email.service';

@Service()
export class AuthService {
  private emailService = Container.get(EmailService);
  public signUp = async ({
    email,
    password,
    passwordConfirm,
  }: ISignUp): Promise<IAuthWithUser> => {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        `This email: ${email} already exists`,
      );
    }

    const newUser = await UserModel.create({
      email,
      password,
      passwordConfirm,
    });

    const token = newUser.createEmailConfirmToken();
    await newUser.save({ validateBeforeSave: false });

    const { email: userEmail, id } = newUser;

    await this.emailService.sendEmailConfirm(token, userEmail);

    const user = await UserModel.findById(id);

    return {
      user,
      ...AuthUtils.getTokens(user.id),
    };
  };

  public signIn = async ({
    email,
    password,
  }: ISignIn): Promise<IAuthWithoutUser> => {
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Email or password are not correct',
      );
    }

    const isPasswordCorrect = await user.isPasswordCorrect(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        HttpStatusCode.FORBIDDEN,
        'Email or password are not correct',
      );
    }

    return AuthUtils.getTokens(user.id);
  };

  public refreshToken = async (token: string): Promise<IAuthWithoutUser> => {
    try {
      const decoded = await verifyToken(token, JWT_REFRESH_SECRET);

      const user = await UserModel.findById(decoded.id);

      if (!user) {
        throw new HttpException(HttpStatusCode.UNAUTHORIZED, 'User not found');
      }

      const passwordChanged = user.changedPasswordAfter(decoded.iat);

      if (passwordChanged) {
        throw new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          'Password changed after last login, please login again',
        );
      }

      return AuthUtils.getTokens(user.id);
    } catch (err) {
      throw new HttpException(
        HttpStatusCode.UNAUTHORIZED,
        'You are not signed in. Please log in',
      );
    }
  };
}
