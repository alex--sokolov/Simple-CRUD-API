import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, create, update, remove, getUserById } from '../models/userModel';
import { getBodyData } from '../utils/getBodyData';
import { UserId } from '../interfaces';

export const getUsers = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'There is a bug in the electrical system!!!' }));
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const body = await getBodyData(req, res);
    try {
      const bodyParsed = JSON.parse(body || '');
      const { username, age, hobbies } = bodyParsed;
      if (!username || !age || !hobbies) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Looks like you didn't specify all the parameters` }));
      } else {
        const user = {
          username: username,
          age: age,
          hobbies: hobbies,
        };
        const newUser = await create(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.write('User was created successfully!\n');
        res.end(JSON.stringify(newUser));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Looks like you made a syntax mistake, when specifying the parameters` }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'There is a bug in the electrical system!!!' }));
  }
};

export const getUser = async (req: IncomingMessage, res: ServerResponse, id: UserId): Promise<void> => {
  try {
    const user = await getUserById(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end('User was not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'There is a bug in the electrical system!!!' }));
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, id: UserId): Promise<void> => {
  console.log(`update ${id}`);
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, id: UserId): Promise<void> => {
  console.log(`delete ${id}`);
};
