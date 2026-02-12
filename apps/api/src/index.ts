import Fastify from 'fastify';
import cors from '@fastify/cors';
import { nanoid } from 'nanoid';
import { envelopeEncrypt, envelopeDecrypt, validateEncryptedData } from '@repo/crypto/index';
import { storage } from './storage.js';
import type { TxSecureRecord, EncryptRequest, DecryptResponse } from './types.js';

const fastify = Fastify({ 
  logger: true,
  // Increase body size limit for large payloads
  bodyLimit: 1048576 // 1MB
});

// Register CORS
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
});

// Health check endpoint
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    records: storage.count()
  };
});

/**
 * POST /tx/encrypt
 * Encrypts and stores a transaction payload
 */
fastify.post<{
  Body: EncryptRequest;
}>('/tx/encrypt', async (request, reply) => {
  const { partyId, payload } = request.body;
  
  // Validate input
  if (!partyId || typeof partyId !== 'string') {
    return reply.code(400).send({ 
      error: 'Invalid request',
      message: 'partyId is required and must be a string' 
    });
  }
  
  if (!payload || typeof payload !== 'object') {
    return reply.code(400).send({ 
      error: 'Invalid request',
      message: 'payload is required and must be an object' 
    });
  }
  
  try {
    // Perform envelope encryption
    const encrypted = envelopeEncrypt(payload);
    
    // Create secure record
    const record: TxSecureRecord = {
      id: nanoid(),
      partyId,
      createdAt: new Date().toISOString(),
      ...encrypted,
      alg: 'AES-256-GCM',
      mk_version: 1
    };
    
    // Store the record
    storage.save(record);
    
    fastify.log.info(`Encrypted transaction ${record.id} for party ${partyId}`);
    
    return reply.code(201).send(record);
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({ 
      error: 'Encryption failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /tx/:id
 * Retrieves an encrypted transaction record (without decryption)
 */
fastify.get<{
  Params: { id: string };
}>('/tx/:id', async (request, reply) => {
  const { id } = request.params;
  
  const record = storage.get(id);
  
  if (!record) {
    return reply.code(404).send({ 
      error: 'Not found',
      message: `Transaction ${id} not found` 
    });
  }
  
  fastify.log.info(`Retrieved transaction ${id}`);
  
  return reply.send(record);
});

/**
 * POST /tx/:id/decrypt
 * Decrypts and returns the original payload
 */
fastify.post<{
  Params: { id: string };
}>('/tx/:id/decrypt', async (request, reply) => {
  const { id } = request.params;
  
  const record = storage.get(id);
  
  if (!record) {
    return reply.code(404).send({ 
      error: 'Not found',
      message: `Transaction ${id} not found` 
    });
  }
  
  // Validate encrypted data structure before decryption
  const validation = validateEncryptedData(record);
  if (!validation.valid) {
    fastify.log.error(`Validation failed for ${id}: ${JSON.stringify(validation.errors)}`);
    return reply.code(400).send({ 
      error: 'Invalid encrypted data',
      message: 'The encrypted data structure is invalid',
      details: validation.errors 
    });
  }
  
  try {
    // Perform envelope decryption
    const decrypted = envelopeDecrypt(record);
    
    const response: DecryptResponse = {
      id: record.id,
      partyId: record.partyId,
      payload: decrypted
    };
    
    fastify.log.info(`Decrypted transaction ${id}`);
    
    return reply.send(response);
  } catch (error) {
    fastify.log.error(`Decryption failed for ${id}: ${error instanceof Error ? error.message : String(error)}`);
    return reply.code(500).send({ 
      error: 'Decryption failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /tx
 * List all transaction IDs (for debugging)
 */
fastify.get('/tx', async () => {
  const all = storage.getAll();
  return {
    count: all.length,
    transactions: all.map(r => ({
      id: r.id,
      partyId: r.partyId,
      createdAt: r.createdAt,
      alg: r.alg
    }))
  };
});

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
