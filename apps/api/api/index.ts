import { createApp } from '../dist/app.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any;

async function getApp() {
  if (!app) {
    app = createApp();
    await app.ready();
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fastify = await getApp();
  fastify.server.emit('request', req, res);
}
