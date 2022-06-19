import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getById, create, update, remove } from '../models/userModel';
import { getBodyData } from '../utils/getBodyData';

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
