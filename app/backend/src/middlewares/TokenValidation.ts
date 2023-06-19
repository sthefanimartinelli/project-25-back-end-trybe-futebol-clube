// import { NextFunction, Request, Response } from 'express';
// import JWTTokenGenerator from '../services/JWTTokenGenerator';

// class TokenValidations {
//   static validateToken(req: Request, res: Response, next: NextFunction): Response | void {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(400).json({ message: 'Token not found' });
//     }
//     const user = JWTTokenGenerator.verify(token);
//     if (!user) {
//       return res.status(401).json({ message: 'Token must be a valid token' });
//     }

//     next();
//   }
// }

// export default TokenValidations;
