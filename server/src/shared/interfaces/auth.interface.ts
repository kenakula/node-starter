import { IUser } from './user.interface';

export interface ISignUp {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface IRefreshToken {
  refreshToken: string;
}

export interface ISignUpResponse {
  user: IUser;
  refreshToken: string;
}

export interface ISignInResponse {
  refreshToken: string;
}

export interface IAuthWithUser {
  user: IUser;
  refreshToken: string;
  authToken: string;
}

export interface IAuthWithoutUser {
  refreshToken: string;
  authToken: string;
}
