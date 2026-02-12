import { randomBytes } from 'crypto';

/**
 * Load the master key from environment variable
 * Master key is used to wrap/unwrap Data Encryption Keys (DEKs)
 */
export function getMasterKey(): Buffer {
  const hexKey = process.env.MASTER_KEY_HEX;
  
  if (!hexKey) {
    throw new Error('MASTER_KEY_HEX environment variable not set');
  }
  
  // Validate hex format (32 bytes = 64 hex characters for AES-256)
  if (!/^[0-9a-f]{64}$/i.test(hexKey)) {
    throw new Error('MASTER_KEY_HEX must be 64 hex characters (32 bytes)');
  }
  
  return Buffer.from(hexKey, 'hex');
}

/**
 * Generate a random Data Encryption Key (DEK)
 * DEK is used to encrypt the actual payload
 */
export function generateDEK(): Buffer {
  return randomBytes(32); // 32 bytes = 256 bits for AES-256
}
