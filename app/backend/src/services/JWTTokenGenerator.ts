import * as jwt from 'jsonwebtoken';
import { IUser } from '../Interfaces/IUser';

function generate(user: IUser): string {
  const token = jwt.sign({ id: user.id }, 'jwt_secret');
  return token;
}

function verify(token: string, jwtSecret: string): string | jwt.JwtPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}

export default { generate, verify };
