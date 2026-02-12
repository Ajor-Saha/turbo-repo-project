/**
 * Validate that a string is valid hex with expected byte length
 * @param value - String to validate
 * @param expectedBytes - Expected number of bytes (not hex chars)
 * @returns true if valid, false otherwise
 */
export function validateHex(value, expectedBytes) {
    const expectedLength = expectedBytes * 2; // 2 hex chars per byte
    if (value.length !== expectedLength) {
        return false;
    }
    // Check if all characters are valid hexadecimal
    return /^[0-9a-f]+$/i.test(value);
}
/**
 * Validate encrypted data structure before decryption
 * Checks nonce lengths, tag lengths, and hex validity
 *
 * @param data - Encrypted data object to validate
 * @returns Validation result with any errors found
 */
export function validateEncryptedData(data) {
    const errors = [];
    // Check payload nonce (12 bytes = 24 hex chars)
    if (!data.payload_nonce || !validateHex(data.payload_nonce, 12)) {
        errors.push('payload_nonce must be 12 bytes (24 hex chars)');
    }
    // Check DEK wrap nonce (12 bytes = 24 hex chars)
    if (!data.dek_wrap_nonce || !validateHex(data.dek_wrap_nonce, 12)) {
        errors.push('dek_wrap_nonce must be 12 bytes (24 hex chars)');
    }
    // Check payload tag (16 bytes = 32 hex chars)
    if (!data.payload_tag || !validateHex(data.payload_tag, 16)) {
        errors.push('payload_tag must be 16 bytes (32 hex chars)');
    }
    // Check DEK wrap tag (16 bytes = 32 hex chars)
    if (!data.dek_wrap_tag || !validateHex(data.dek_wrap_tag, 16)) {
        errors.push('dek_wrap_tag must be 16 bytes (32 hex chars)');
    }
    // Check ciphertext is valid hex (variable length, just check format)
    if (!data.payload_ct || !/^[0-9a-f]+$/i.test(data.payload_ct)) {
        errors.push('payload_ct must be valid hex');
    }
    // Check DEK wrapped is valid hex
    if (!data.dek_wrapped || !/^[0-9a-f]+$/i.test(data.dek_wrapped)) {
        errors.push('dek_wrapped must be valid hex');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
