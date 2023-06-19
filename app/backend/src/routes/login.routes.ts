import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
// import JWTTokenGenerator from '../services/JWTTokenGenerator';
import EncrypterBcrypt from '../services/EncrypterBcrypt';
import UserService from '../services/UserService';
import UserModel from '../models/UserModel';
import LoginValidations from '../middlewares/LoginValidations';
import TokenValidation from '../middlewares/TokenValidation';

const userModel = new UserModel();
const encrypter = new EncrypterBcrypt();
// const tokenGenerator = new JWTTokenGenerator();
const userService = new UserService(userModel, encrypter);
const userController = new UserController(userService);

const router = Router();

const { validateEmail, validatePassword, validateLogin } = LoginValidations;
const { validateToken } = TokenValidation;

router.post(
  '/',
  validateLogin,
  validatePassword,
  validateEmail,
  (req: Request, res: Response) => userController.login(req, res),
);

router.get(
  '/role',
  validateToken,
  (req: Request, res: Response) => userController.getRoleInfo(req, res),
);

export default router;
