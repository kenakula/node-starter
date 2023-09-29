export type TUserRole = 'user' | 'admin';

export interface IUser {
  name: string;
  role: TUserRole;
}
