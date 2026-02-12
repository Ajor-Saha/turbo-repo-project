import { createDecipheriv } from 'crypto';
import { getMasterKey } from './masterKey.js';
/**
 * Decrypt data using AES-256-GCM
 * @param ciphertext - Hex-encoded encrypted data
 * @param key - 32-byte decryption key
 * @param nonce - Hex-encoded 12-byte nonce (IV)
 * @param tag - Hex-encoded 16-byte authentication tag
 * @returns Decrypted data as Buffer
 * @throws Error if decryption fails (wrong key, tampered data, etc.)
 */
function decryptWithKey(ciphertext, key, nonce, tag) {
    // Convert hex strings to buffers
    const nonceBuffer = Buffer.from(nonce, 'hex');
    const tagBuffer = Buffer.from(tag, 'hex');
    const ctBuffer = Buffer.from(ciphertext, 'hex');
    // Validate nonce length (must be 12 bytes for GCM)
    if (nonceBuffer.length !== 12) {
        throw new Error('Nonce must be 12 bytes');
    }
    // Validate tag length (must be 16 bytes for GCM)
    if (tagBuffer.length !== 16) {
        throw new Error('Tag must be 16 bytes');
    }
    // Create decipher with AES-256-GCM
    const decipher = createDecipheriv('aes-256-gcm', key, nonceBuffer);
    // Set the authentication tag
    decipher.setAuthTag(tagBuffer);
    // Decrypt the data
    // This will throw if authentication fails (tampered data)
    let plaintext = decipher.update(ctBuffer);
    plaintext = Buffer.concat([plaintext, decipher.final()]);
    return plaintext;
}
/**
 * Envelope decryption: unwrap DEK using master key, then decrypt payload using DEK
 *
 * @param encrypted - Complete envelope encryption result
 * @returns Original payload (parsed JSON)
 * @throws Error if decryption fails, data is tampered, or validation fails
 */
export function envelopeDecrypt(encrypted) {
    // Step 1: Unwrap (decrypt) DEK using master key
    const masterKey = getMasterKey();
    const dek = decryptWithKey(encrypted.dek_wrapped, masterKey, encrypted.dek_wrap_nonce, encrypted.dek_wrap_tag);
    // Step 2: Decrypt payload using unwrapped DEK
    const payloadBuffer = decryptWithKey(encrypted.payload_ct, dek, encrypted.payload_nonce, encrypted.payload_tag);
    // Step 3: Parse and return the JSON payload
    const payloadJson = payloadBuffer.toString('utf-8');
    return JSON.parse(payloadJson);
}
