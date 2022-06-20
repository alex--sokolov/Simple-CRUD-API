import { IUser, UserId } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import { pid } from 'process';

let users: IUser[] = [];

process.on('message', (usersUpdated: IUser[]) => {
  console.log(usersUpdated);
  users = usersUpdated;
});

export const getAllUsers = (): Promise<IUser[]> => {
  return new Promise((resolve) => {
    resolve(users);
  });
};

export const getUserById = (id: UserId): Promise<IUser | undefined> => {
  return new Promise((resolve) => {
    const userRequested = users.find((user) => user.id === id);
    resolve(userRequested);
  });
};

export const create = (user: Omit<IUser, 'id'>): Promise<IUser> => {
  return new Promise((resolve) => {
    const newUser = { id: uuidv4(), ...user };
    users.push(newUser);
    process.send?.({ users, pid });
    resolve(newUser);
  });
};

export const update = (id: UserId, userInfo: Omit<IUser, 'id'>) => {
  return new Promise((resolve) => {
    const index = users.findIndex((user) => user.id === id);
    users[index] = { id, ...userInfo };
    process.send?.({ users, pid });
    resolve(users[index]);
  });
};

export const remove = (id: UserId): Promise<void> => {
  return new Promise((resolve) => {
    users = users.filter((user) => user.id !== id);
    process.send?.({ users, pid });
    resolve();
  });
};
