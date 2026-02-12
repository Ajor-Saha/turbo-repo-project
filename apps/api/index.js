import { createApp } from './dist/app.js';

let app;

async function getApp() {
  if (!app) {
    app = createApp();
    await app.ready();
  }
  return app;
}

export default async function handler(req, res) {
  const fastify = await getApp();
  fastify.server.emit('request', req, res);
}
