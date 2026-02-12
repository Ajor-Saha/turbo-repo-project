/**
 * Load the master key from environment variable
 * Master key is used to wrap/unwrap Data Encryption Keys (DEKs)
 */
export declare function getMasterKey(): Buffer;
/**
 * Generate a random Data Encryption Key (DEK)
 * DEK is used to encrypt the actual payload
 */
export declare function generateDEK(): Buffer;
//# sourceMappingURL=masterKey.d.ts.map