import type { EnvelopeEncryptResult } from './types.js';
/**
 * Envelope encryption: encrypt payload with DEK, then wrap DEK with master key
 * This provides an extra layer of security and allows key rotation
 *
 * @param payload - Any JSON-serializable payload
 * @returns Complete envelope encryption result with all encrypted components
 */
export declare function envelopeEncrypt(payload: any): EnvelopeEncryptResult;
//# sourceMappingURL=encrypt.d.ts.map