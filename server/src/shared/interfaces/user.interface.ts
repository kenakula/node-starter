export type TUserRole = 'user' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  emailConfirmToken: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
  emailConfirmed: boolean;
  role: TUserRole;
  active: boolean;
}

export interface IUserSchemaMethods {
  createEmailConfirmToken: () => string;
  isPasswordCorrect: (
    candidate: string,
    userPassword: string,
  ) => Promise<boolean>;
  changedPasswordAfter: (timestamp: number) => boolean;
  createPasswordResetToken: () => string;
}
