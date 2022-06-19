import { createServer } from 'http';
import { getUsers, createUser } from './controllers/userController';

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

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
