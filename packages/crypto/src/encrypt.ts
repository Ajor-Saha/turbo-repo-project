import { createCipheriv, randomBytes } from 'crypto';
import { getMasterKey, generateDEK } from './masterKey.js';
import type { EncryptedData, EnvelopeEncryptResult } from './types.js';

/**
 * Encrypt data using AES-256-GCM
 * @param data - Buffer to encrypt
 * @param key - 32-byte encryption key
 * @returns Object containing nonce, ciphertext, and authentication tag (all as hex strings)
 */
function encryptWithKey(data: Buffer, key: Buffer): EncryptedData {
  // Generate random 12-byte nonce (IV) for GCM mode
  const nonce = randomBytes(12);
  
  // Create cipher with AES-256-GCM
  const cipher = createCipheriv('aes-256-gcm', key, nonce);
  
  // Encrypt the data
  let ciphertext = cipher.update(data);
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  
  // Get authentication tag (16 bytes for GCM)
  const tag = cipher.getAuthTag();
  
  // Return all values as hex strings for storage
  return {
    nonce: nonce.toString('hex'),
    ciphertext: ciphertext.toString('hex'),
    tag: tag.toString('hex')
  };
}

/**
 * Envelope encryption: encrypt payload with DEK, then wrap DEK with master key
 * This provides an extra layer of security and allows key rotation
 * 
 * @param payload - Any JSON-serializable payload
 * @returns Complete envelope encryption result with all encrypted components
 */
export function envelopeEncrypt(payload: any): EnvelopeEncryptResult {
  // Step 1: Generate a random Data Encryption Key (DEK)
  const dek = generateDEK();
  
  // Step 2: Encrypt payload with DEK
  const payloadJson = JSON.stringify(payload);
  const payloadBuffer = Buffer.from(payloadJson, 'utf-8');
  const encryptedPayload = encryptWithKey(payloadBuffer, dek);
  
  // Step 3: Wrap (encrypt) DEK with master key
  const masterKey = getMasterKey();
  const wrappedDEK = encryptWithKey(dek, masterKey);
  
  // Step 4: Return complete envelope encryption result
  return {
    payload_nonce: encryptedPayload.nonce,
    payload_ct: encryptedPayload.ciphertext,
    payload_tag: encryptedPayload.tag,
    dek_wrap_nonce: wrappedDEK.nonce,
    dek_wrapped: wrappedDEK.ciphertext,
    dek_wrap_tag: wrappedDEK.tag
  };
}
