import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class UserController {
  constructor(
    private userService: UserService,
  ) { }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const serviceResponse = await this.userService.login(email, password);
    if (serviceResponse.status !== 'successful') {
      const code = mapStatusHTTP(serviceResponse.status);
      return res.status(code).json(serviceResponse.data);
    }
    return res.status(200).json(serviceResponse.data);
  }

  public async getRoleInfo(req: Request, res: Response): Promise<Response> {
    const { id } = req.body.user;
    const serviceResponse = await this.userService.findById(id);
    if (serviceResponse.status !== 'successful') {
      const code = mapStatusHTTP(serviceResponse.status);
      return res.status(code).json(serviceResponse.data);
    }
    return res.status(200).json({ role: serviceResponse.data.role });
  }
}
