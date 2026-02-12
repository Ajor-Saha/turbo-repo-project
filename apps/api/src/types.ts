/**
 * Secure transaction record type
 * Stores encrypted payload and wrapped DEK with metadata
 */
export type TxSecureRecord = {
  id: string;
  partyId: string;
  createdAt: string;
  
  // Payload encrypted with DEK
  payload_nonce: string;
  payload_ct: string;
  payload_tag: string;
  
  // DEK wrapped with Master Key
  dek_wrap_nonce: string;
  dek_wrapped: string;
  dek_wrap_tag: string;
  
  // Algorithm metadata
  alg: "AES-256-GCM";
  mk_version: 1;
};

/**
 * Request body for encrypting a transaction
 */
export interface EncryptRequest {
  partyId: string;
  payload: any; // JSON-serializable payload
}

/**
 * Response for decrypted transaction
 */
export interface DecryptResponse {
  id: string;
  partyId: string;
  payload: any;
}
