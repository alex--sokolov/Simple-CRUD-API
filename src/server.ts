import { createServer } from 'http';
import { users } from './models/userModel';

const PORT = process.env.PORT || 5000;

export const server = createServer((req, res) => {
  try {
    if (req.url === '/api/users') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(users));
      res.end();
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
