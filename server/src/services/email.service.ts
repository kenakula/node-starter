import { Service } from 'typedi';
import nodemailer from 'nodemailer';
import {
  apiUrl,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} from '@app/configs';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';

export interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
  from: string;
}

@Service()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly host = EMAIL_HOST || 'host';
  private readonly port = EMAIL_PORT || '5432';
  private readonly user = EMAIL_USERNAME || 'username';
  private readonly pass = EMAIL_PASSWORD || 'password';

  public async send(options: IEmailOptions): Promise<void> {
    return this.transporter.sendMail(options);
  }

  public init() {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: Number(this.port),
      from: 'node@starter.com',
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  public sendEmailConfirm = async (
    token: string,
    email: string,
  ): Promise<void> => {
    const confirmUrl = `${apiUrl}/users/confirm-email/${token}`;
    const message = `To confirm your email follow the link. ${confirmUrl}`;

    try {
      await this.send({
        to: email,
        subject: 'Node Starter. Verify your email',
        text: message,
        from: 'node@starter.com',
      });
    } catch (err) {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'There was an error sending an email. Try again later',
      );
    }
  };

  public sendResetPassword = async (
    token: string,
    email: string,
  ): Promise<void> => {
    const confirmUrl = `${apiUrl}/users/reset-password/${token}`;
    const message = `To reset your password follow the link. ${confirmUrl}`;

    try {
      await this.send({
        to: email,
        subject: 'Node Starter. Password reset',
        text: message,
        from: 'node@starter.com',
      });
    } catch (err) {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'There was an error sending an email. Try again later',
      );
    }
  };
}
