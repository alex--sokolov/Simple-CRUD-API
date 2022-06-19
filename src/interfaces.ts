import { v4 as uuidv4 } from 'uuid';

export interface IUser {
  id: string | typeof uuidv4;
  username: string;
  age: number;
  hobbies: string[] | [];
}
