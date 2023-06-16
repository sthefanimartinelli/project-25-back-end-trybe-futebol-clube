import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import JWTTokenGenerator from '../services/JWTTokenGenerator';
import EncrypterBcrypt from '../services/EncrypterBcrypt';
import UserService from '../services/UserService';
import UserModel from '../models/UserModel';
import LoginValidations from '../middlewares/LoginValidations';

const userModel = new UserModel();
const encrypter = new EncrypterBcrypt();
const tokenGenerator = new JWTTokenGenerator();
const userService = new UserService(userModel, encrypter, tokenGenerator);
const userController = new UserController(userService);

const router = Router();

const { validateEmail, validatePassword, validateLogin } = LoginValidations;

router.post(
  '/',
  validateLogin,
  validatePassword,
  validateEmail,
  (req: Request, res: Response) => userController.login(req, res),
);

export default router;
