/**
 * Encrypted data structure for a single encryption operation
 */
export interface EncryptedData {
    nonce: string;
    ciphertext: string;
    tag: string;
}
/**
 * Complete envelope encryption result
 * Contains both encrypted payload and wrapped DEK
 */
export interface EnvelopeEncryptResult {
    payload_nonce: string;
    payload_ct: string;
    payload_tag: string;
    dek_wrap_nonce: string;
    dek_wrapped: string;
    dek_wrap_tag: string;
}
//# sourceMappingURL=types.d.ts.map