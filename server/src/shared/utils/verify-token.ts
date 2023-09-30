import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = async (
  token: string,
  secret: string,
): Promise<jwt.JwtPayload | null> => {
  return new Promise((resolve, reject) =>
    jwt.verify(
      token,
      secret,
      (err, data: string | jwt.JwtPayload): JwtPayload | null => {
        if (err) {
          reject(err);
          return null;
        }

        resolve(data as jwt.JwtPayload);
        return data as jwt.JwtPayload;
      },
    ),
  );
};
