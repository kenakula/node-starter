import { Container, Service } from 'typedi';
import {
  IAuthWithoutUser,
  IForgotPassword,
  IResetPassword,
  IUpdatePassword,
  IUser,
} from '@shared/interfaces';
import { UserModel } from '@app/models';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';
import { EmailService } from '@app/services/email.service';
import crypto from 'crypto';
import { AuthUtils } from '@shared/utils';

@Service()
export class UserService {
  private emailService = Container.get(EmailService);

  public async getUsers(): Promise<IUser[]> {
    const data: IUser[] = await UserModel.find();

    return data;
  }

  public async getUser(id: string): Promise<IUser> {
    const data: IUser = await UserModel.findById(id);

    return data;
  }

  public async createUser(data: IUser): Promise<IUser> {
    const user = await UserModel.findOne({ email: data.email });

    if (user) {
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        'User with such email exists',
      );
    }

    const newUser = await UserModel.create<IUser>(data);

    const token = newUser.createEmailConfirmToken();
    await this.emailService.sendEmailConfirm(token, newUser.email);
    await newUser.save({ validateBeforeSave: false });

    // TODO exclude password and emailConfirmToken from response

    return newUser;
  }

  public async updateUser(id: string, patch: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'No user found to update',
      );
    }

    return user;
  }

  public deleteUser = async (id: string): Promise<void> => {
    const user = await UserModel.findByIdAndRemove(id);

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'No user found to delete',
      );
    }
  };

  public forgotPassword = async ({ email }: IForgotPassword): Promise<void> => {
    const user = await UserModel.findOne({
      email,
      emailConfirmed: { $ne: false },
    });

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        "There is no user with that email address. Or maybe you haven't confirmed your email address. Look into your email.",
      );
    }

    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    await this.emailService.sendResetPassword(token, email);
  };

  public resetPassword = async (
    { password: newPassword, passwordConfirm }: IResetPassword,
    token: string,
  ) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      passwordResetToken: { $eq: hashedToken },
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Invalid or expired reset token',
      );
    }

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
  };

  public confirmEmail = async (token: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      emailConfirmToken: hashedToken,
      emailConfirmed: { $ne: true },
    });

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Invalid or expired confirm token',
      );
    }

    user.emailConfirmed = true;
    user.emailConfirmToken = undefined;

    await user.save({ validateBeforeSave: false });
  };

  public updatePassword = async (
    { password, passwordConfirm, currentPassword }: IUpdatePassword,
    userId: string,
  ): Promise<IAuthWithoutUser> => {
    const user = await UserModel.findById(userId).select('+password');

    const isCorrect = user.isPasswordCorrect(currentPassword, user.password);

    if (!isCorrect) {
      throw new HttpException(
        HttpStatusCode.UNAUTHORIZED,
        'Incorrect current password',
      );
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordChangedAt = new Date();

    await user.save();

    return AuthUtils.getTokens(user.id);
  };
}
