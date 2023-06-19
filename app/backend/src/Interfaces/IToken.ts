import { JwtPayload } from 'jsonwebtoken';
import { IUser } from './IUser';

export interface IToken {
  generate(user: IUser): string;
  verify(token: string, jwtSecret: string): string | JwtPayload | null;
}
