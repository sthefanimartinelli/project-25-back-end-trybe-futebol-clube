// import { ICRUDModelReader } from './ICRUDModel';
import { IUser } from './IUser';

export type IUserModel = {
  findById(id: number): Promise<IUser | null>
  findByEmail(email: string): Promise<IUser | null>
};
