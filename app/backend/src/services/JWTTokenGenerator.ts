import * as jwt from 'jsonwebtoken';
import { IUser } from '../Interfaces/IUser';
import { IToken } from '../Interfaces/IToken';

export default class JWTTokenGenerator implements IToken {
  private jwt = jwt;

  // const secret = process.env.JWT_SECRET || 'jwt_secret';

  generate(user: IUser): string {
    const token = this.jwt.sign({ id: user.id }, 'jwt_secret');
    return token;
  }
}
