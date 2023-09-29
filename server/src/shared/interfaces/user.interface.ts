export type TUserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  emailConfirmToken: string;
  passwordChangedAt: Date;
  emailConfirmed: boolean;
  role: TUserRole;
  active: boolean;
}

export interface IUserMethods {
  createEmailConfirmToken: () => string;
}

export interface ISignUp {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ISignUpResponse {
  user: IUser;
  refreshToken: string;
}

export interface ISignUpServiceValue {
  user: IUser;
  refreshToken: string;
  authToken: string;
}
