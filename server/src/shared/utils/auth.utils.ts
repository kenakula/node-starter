import { sign } from 'jsonwebtoken';
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET_KEY,
} from '@app/configs';
import { IAuthWithoutUser } from '@shared/interfaces';

export class AuthUtils {
  public static issueAuthToken(id: string): string {
    return sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  }

  public static issueRefreshToken(id: string): string {
    return sign({ id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  public static getTokens = (id: string): IAuthWithoutUser => ({
    refreshToken: this.issueRefreshToken(id),
    authToken: this.issueAuthToken(id),
  });
}
