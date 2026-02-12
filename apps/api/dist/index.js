import { createApp } from './app.js';
const app = createApp();
export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
};
