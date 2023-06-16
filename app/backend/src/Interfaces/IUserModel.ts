// import { ICRUDModelReader } from './ICRUDModel';
import { IUser } from './IUser';

export type IUserModel = {
  findByEmail(email: string): Promise<IUser | null>
};
