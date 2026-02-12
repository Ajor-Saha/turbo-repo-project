import { describe, it, expect } from 'vitest';
import { validateHex, validateEncryptedData } from './validation';

describe('Validation Functions', () => {
  describe('validateHex', () => {
    it('should validate correct hex strings', () => {
      expect(validateHex('0123456789abcdef', 8)).toBe(true);
      expect(validateHex('ABCDEF1234567890', 8)).toBe(true);
    });
    
    it('should reject invalid length', () => {
      expect(validateHex('0123', 8)).toBe(false); // too short
      expect(validateHex('0123456789abcdef00', 8)).toBe(false); // too long
    });
    
    it('should reject non-hex characters', () => {
      expect(validateHex('xyz123456789abcd', 8)).toBe(false);
      expect(validateHex('0123-5678-9abc-def0', 8)).toBe(false);
    });
  });
  
  describe('validateEncryptedData', () => {
    it('should validate correct encrypted data', () => {
      const data = {
        payload_nonce: '000102030405060708090a0b', // 12 bytes = 24 hex chars
        payload_ct: 'abcdef0123456789',
        payload_tag: '0123456789abcdef0123456789abcdef', // 16 bytes = 32 hex chars
        dek_wrap_nonce: '0c0d0e0f1011121314151617', // 12 bytes = 24 hex chars
        dek_wrapped: '1234567890abcdef',
        dek_wrap_tag: 'fedcba9876543210fedcba9876543210' // 16 bytes = 32 hex chars
      };
      
      const result = validateEncryptedData(data);
      if (!result.valid) {
        console.log('Validation errors:', result.errors);
      }
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
    
    it('should reject invalid nonce length', () => {
      const data = {
        payload_nonce: 'short', // wrong length
        payload_ct: 'abcdef',
        payload_tag: '0123456789abcdef0123456789abcdef',
        dek_wrap_nonce: '000102030405060708090a0b',
        dek_wrapped: 'abcdef',
        dek_wrap_tag: 'fedcba9876543210fedcba9876543210'
      };
      
      const result = validateEncryptedData(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('payload_nonce must be 12 bytes (24 hex chars)');
    });
    
    it('should reject invalid tag length', () => {
      const data = {
        payload_nonce: '000102030405060708090a0b',
        payload_ct: 'abcdef',
        payload_tag: 'tooshort', // wrong length
        dek_wrap_nonce: '000102030405060708090a0b',
        dek_wrapped: 'abcdef',
        dek_wrap_tag: 'fedcba9876543210fedcba9876543210'
      };
      
      const result = validateEncryptedData(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('payload_tag must be 16 bytes (32 hex chars)');
    });
    
    it('should reject multiple invalid fields', () => {
      const data = {
        payload_nonce: 'bad',
        payload_ct: 'xyz!!!', // invalid hex
        payload_tag: 'wrong',
        dek_wrap_nonce: 'bad',
        dek_wrapped: 'invalid!!!',
        dek_wrap_tag: 'wrong'
      };
      
      const result = validateEncryptedData(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});
