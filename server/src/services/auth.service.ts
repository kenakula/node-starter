import { Container, Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { ISignUp, ISignUpServiceValue } from '@shared/interfaces';
import { UserModel } from '@app/models';
import { HttpException } from '@app/exceptions';
import {
  apiUrl,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET_KEY,
  PASSWORD_HASH_SALT,
  protocol,
} from '@app/configs';
import { HttpStatusCode } from '@shared/enums';
import { EmailService } from './email.service';

@Service()
export class AuthService {
  private emailService = Container.get(EmailService);
  public signUp = async ({
    email,
    password,
  }: ISignUp): Promise<ISignUpServiceValue> => {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        `This email: ${email} already exists`,
      );
    }

    const hashedPassword = await hash(password, PASSWORD_HASH_SALT);
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
    });

    const token = newUser.createEmailConfirmToken();
    await newUser.save({ validateBeforeSave: false });

    const { email: userEmail, _id } = newUser;

    await this.sendEmail(token, userEmail);

    const authToken = this.issueAuthToken(_id.toString());
    const refreshToken = this.issueRefreshToken(_id.toString());

    return {
      user: newUser,
      authToken,
      refreshToken,
    };
  };

  private issueAuthToken(id: string): string {
    return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  }

  private issueRefreshToken(id: string): string {
    return jwt.sign({ id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  private async sendEmail(token: string, email: string): Promise<void> {
    const confirmUrl = `${protocol}://${apiUrl}/users/confirm-email/${token}`;
    const message = `To confirm your email follow the link. ${confirmUrl}`;

    try {
      await this.emailService.send({
        to: email,
        subject: 'Node Starter. Verify your email',
        text: message,
      });
    } catch (err) {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'There was an error sending an email. Try again later',
      );
    }
  }
}
