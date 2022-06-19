import { IncomingMessage, ServerResponse } from 'http';

export const getBodyData = (req: IncomingMessage, res: ServerResponse): Promise<string | void> => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk: Buffer): void => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'There is a bug in the electrical system!!!' }));
      reject(error);
    }
  });
};
