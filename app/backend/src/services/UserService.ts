// import { IToken } from '../Interfaces/IToken';
import { IEncrypter } from '../Interfaces/IEncrypter';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { IUserModel } from '../Interfaces/IUserModel';
import JWTTokenGenerator from './JWTTokenGenerator';

export default class UserService {
  constructor(
    private userModel: IUserModel,
    private encrypter: IEncrypter,
  ) { }

  public async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const user = await this.userModel.findByEmail(email);

    if (!user) {
      return { status: 'unauthorized', data: { message: 'Invalid email or password' } };
    }

    const isValid = await this.encrypter.compare(password, user.password);

    if (!isValid) {
      return { status: 'unauthorized', data: { message: 'Invalid email or password' } };
    }

    console.log('Hello');
    const token = JWTTokenGenerator.generate(user);
    console.log(token);

    return {
      status: 'successful',
      data: { token },
    };
  }
}