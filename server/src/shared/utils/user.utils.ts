import { ISafeUser, IUser } from '@shared/interfaces';

export class UserUtils {
  public static normalizeToSafeUser = ({
    email,
    role,
    emailConfirmed,
    name,
    id,
  }: IUser): ISafeUser => ({
    email,
    emailConfirmed,
    role,
    name,
    id,
  });
}
