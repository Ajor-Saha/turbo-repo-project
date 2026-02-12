import { createApp } from './app.js';

const app = createApp();

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};
