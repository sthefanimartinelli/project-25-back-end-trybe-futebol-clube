import { NextFunction, Request, Response } from 'express';

class LoginValidations {
  static validateLogin(req: Request, res: Response, next: NextFunction): Response | void {
    const login = req.body;
    const { email, password } = login;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }

  static validatePassword(req: Request, res: Response, next: NextFunction): Response | void {
    const { password } = req.body;
    if (password.length <= 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next();
  }

  static validateEmail(req: Request, res: Response, next: NextFunction): Response | void {
    const { email } = req.body;
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;

    const isEmailValid = emailRegex.test(email);

    if (!isEmailValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    next();
  }
}

export default LoginValidations;
