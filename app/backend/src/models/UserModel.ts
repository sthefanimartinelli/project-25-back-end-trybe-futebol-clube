import { IUserModel } from '../Interfaces/IUserModel';
import SequelizeUser from '../database/models/SequelizeUser';
import { IUser } from '../Interfaces/IUser';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      password: user.password,
    };
  }

  async findById(id: IUser['id']): Promise<IUser | null> {
    const user = await this.model.findByPk(id);
    if (!user) return null;
    const { username, role, email, password } = user;
    return { id, username, role, email, password };
  }
}
