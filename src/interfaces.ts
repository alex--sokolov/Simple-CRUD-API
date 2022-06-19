import { v4 as uuidv4 } from 'uuid';

export type UserId = string | typeof uuidv4;

export interface IUser {
  id: UserId;
  username: string;
  age: number;
  hobbies: string[] | [];
}
