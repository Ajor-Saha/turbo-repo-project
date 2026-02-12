import { createApp } from './app.js';
const fastify = createApp();
// Start server
const PORT = parseInt(process.env.PORT || '3002', 10);
const HOST = process.env.HOST || '0.0.0.0';
fastify.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📦 Endpoints:`);
    console.log(`   POST   /tx/encrypt    - Encrypt & store transaction`);
    console.log(`   GET    /tx/:id        - Retrieve encrypted record`);
    console.log(`   POST   /tx/:id/decrypt - Decrypt transaction`);
    console.log(`   GET    /tx            - List all transactions`);
    console.log(`   GET    /health        - Health check`);
});
