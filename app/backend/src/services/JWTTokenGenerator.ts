import * as jwt from 'jsonwebtoken';
import { IUser } from '../Interfaces/IUser';
// import { IToken } from '../Interfaces/IToken';

// export default class JWTTokenGenerator implements IToken {
//   private jwt = jwt;

//   generate(user: IUser): string {
//     const token = this.jwt.sign({ id: user.id }, 'jwt_secret');
//     return token;
//   }

//   verify(token: string): string | jwt.JwtPayload | null {
//     try {
//       const decoded = this.jwt.verify(token, 'jwt_secret');
//       return decoded;
//     } catch (error) {
//       return null;
//     }
//   }
// }

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
