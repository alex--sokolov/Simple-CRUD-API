import { server } from './app';

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server started. Port ${PORT}. Pid: ${process.pid}`));
