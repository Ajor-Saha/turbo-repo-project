/**
 * Encrypted data structure for a single encryption operation
 */
export interface EncryptedData {
  nonce: string;      // 12 bytes (24 hex chars) - IV for GCM mode
  ciphertext: string; // Variable length - encrypted data
  tag: string;        // 16 bytes (32 hex chars) - authentication tag
}

/**
 * Complete envelope encryption result
 * Contains both encrypted payload and wrapped DEK
 */
export interface EnvelopeEncryptResult {
  // Payload encrypted with DEK
  payload_nonce: string;
  payload_ct: string;
  payload_tag: string;
  
  // DEK wrapped with Master Key
  dek_wrap_nonce: string;
  dek_wrapped: string;
  dek_wrap_tag: string;
}
