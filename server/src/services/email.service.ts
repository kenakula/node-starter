import { Service } from 'typedi';
import nodemailer, { TransportOptions } from 'nodemailer';
import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USERNAME,
} from '@app/configs';

export interface IEmailOptions {
  to: string;
  subject: string;
  text: string;
}

@Service()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly host = EMAIL_HOST || 'host';
  private readonly port = EMAIL_PORT || '5432';
  private readonly user = EMAIL_USERNAME || 'username';
  private readonly pass = EMAIL_PASSWORD || 'password';

  constructor() {
    this.init();
  }

  public async send(options: IEmailOptions): Promise<void> {
    return this.transporter.sendMail(options);
  }

  init() {
    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: Number(this.port),
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }
}
