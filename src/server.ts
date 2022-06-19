import { createServer } from 'http';
import { getUsers, createUser, getUser, updateUser, deleteUser } from './controllers/userController';
import { isUUIDV4 } from './utils/isUUIDv4';

const PORT = process.env.PORT || 5000;

export const server = createServer((req, res) => {
  try {
    if (req.url === '/api/users') {
      if (req.method === 'GET') {
        return getUsers(req, res);
      }
      if (req.method === 'POST') {
        return createUser(req, res);
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Looks like you specified a wrong method for the url' }));
    }
    if (req.url && req.url.match(/\/api\/users\/\w+/)) {
      const id = req.url.split('/')[3];

      if (isUUIDV4(id)) {
        if (req.method === 'GET') {
          return getUser(req, res, id);
        }

        if (req.method === 'PUT') {
          return updateUser(req, res, id);
        }

        if (req.method === 'DELETE') {
          return deleteUser(req, res, id);
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Looks like you specified a wrong method for the url' }));
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: `The id, that you've entered (${id}), is not valid! It must be of type uuidv4` })
      );
    } else {
      {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Oh my gosh! You've entered a wrong path` }));
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'There is a bug in the electrical system!!!' }));
  }
});

server.listen(PORT, () => console.log(`Server started. Port ${PORT}. Pid: ${process.pid}`));
