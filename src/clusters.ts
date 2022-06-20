import cluster, { Worker } from 'cluster';
import { cpus } from 'os';
import { IWorkerMessage } from './interfaces';

let workers: Worker[] = [];

const killWorker = (worker: Worker) => {
  console.log(`Worker died! Pid ${worker.process.pid}`);
  workers = workers.filter((w) => w.process.pid !== worker.process.pid);
  console.log(workers.map((w) => w.process.pid));
};

const addWorker = () => {
  const worker = cluster.fork();
  workers.push(worker);
  worker.on('exit', () => {
    killWorker(worker);
    addWorker();
  });
  worker.on('message', ({ users, pid }: IWorkerMessage) => {
    workers.forEach((w: Worker) => {
      console.log(`Users: ${JSON.stringify(users)} Pid: ${pid}`);
      if (w.process.pid !== pid) w.send(users);
    });
  });
  console.log(workers.map((w) => w.process.pid));
};

void (async () => {
  if (cluster.isPrimary) {
    const cpusCount = cpus().length;
    console.log(`CPUs: ${cpusCount}`);
    console.log(`Master started. Pid: ${process.pid}`);
    for (let i = 0; i < cpusCount - 1; i++) {
      addWorker();
    }
    console.log(workers.map((w) => w.process.pid));
  } else {
    await import('./server');
    const id = cluster.worker?.id;
    console.log(`Worker id: ${id}. Pid: ${process.pid}`);
  }
})();
