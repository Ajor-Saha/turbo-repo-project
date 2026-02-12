import type { EnvelopeEncryptResult } from './types.js';
/**
 * Envelope decryption: unwrap DEK using master key, then decrypt payload using DEK
 *
 * @param encrypted - Complete envelope encryption result
 * @returns Original payload (parsed JSON)
 * @throws Error if decryption fails, data is tampered, or validation fails
 */
export declare function envelopeDecrypt(encrypted: EnvelopeEncryptResult): any;
//# sourceMappingURL=decrypt.d.ts.map