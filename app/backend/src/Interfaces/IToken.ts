import { IUser } from './IUser';

export interface IToken {
  generate(user: IUser): string
}
