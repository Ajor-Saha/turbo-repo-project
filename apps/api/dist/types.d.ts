/**
 * Secure transaction record type
 * Stores encrypted payload and wrapped DEK with metadata
 */
export type TxSecureRecord = {
    id: string;
    partyId: string;
    createdAt: string;
    payload_nonce: string;
    payload_ct: string;
    payload_tag: string;
    dek_wrap_nonce: string;
    dek_wrapped: string;
    dek_wrap_tag: string;
    alg: "AES-256-GCM";
    mk_version: 1;
};
/**
 * Request body for encrypting a transaction
 */
export interface EncryptRequest {
    partyId: string;
    payload: any;
}
/**
 * Response for decrypted transaction
 */
export interface DecryptResponse {
    id: string;
    partyId: string;
    payload: any;
}
//# sourceMappingURL=types.d.ts.map