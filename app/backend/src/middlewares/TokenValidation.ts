import { NextFunction, Request, Response } from 'express';
import JWTTokenGenerator from '../services/JWTTokenGenerator';

class TokenValidations {
  static validateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }
    // const user = JWTTokenGenerator.verify(token);
    const user = JWTTokenGenerator.verify(token, 'jwt_secret');
    if (!user) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    req.body.user = user;

    next();
  }
}

export default TokenValidations;
