/**
 * Validate that a string is valid hex with expected byte length
 * @param value - String to validate
 * @param expectedBytes - Expected number of bytes (not hex chars)
 * @returns true if valid, false otherwise
 */
export declare function validateHex(value: string, expectedBytes: number): boolean;
/**
 * Validation result with detailed error messages
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
/**
 * Validate encrypted data structure before decryption
 * Checks nonce lengths, tag lengths, and hex validity
 *
 * @param data - Encrypted data object to validate
 * @returns Validation result with any errors found
 */
export declare function validateEncryptedData(data: any): ValidationResult;
//# sourceMappingURL=validation.d.ts.map