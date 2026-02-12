import { describe, it, expect, beforeAll } from 'vitest';
import { envelopeEncrypt } from './encrypt';
import { envelopeDecrypt } from './decrypt';

// Set up master key for tests
beforeAll(() => {
  process.env.MASTER_KEY_HEX = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
});

describe('Envelope Encryption', () => {
  it('should encrypt and decrypt correctly', () => {
    const payload = { amount: 100, currency: 'AED' };
    
    const encrypted = envelopeEncrypt(payload);
    const decrypted = envelopeDecrypt(encrypted);
    
    expect(decrypted).toEqual(payload);
  });
  
  it('should fail with tampered ciphertext', () => {
    const payload = { amount: 100 };
    const encrypted = envelopeEncrypt(payload);
    
    // Tamper with payload ciphertext
    encrypted.payload_ct = 'deadbeef';
    
    expect(() => envelopeDecrypt(encrypted)).toThrow();
  });
  
  it('should fail with tampered tag', () => {
    const payload = { amount: 100 };
    const encrypted = envelopeEncrypt(payload);
    
    // Tamper with authentication tag
    encrypted.payload_tag = 'ffffffffffffffffffffffffffffffff';
    
    expect(() => envelopeDecrypt(encrypted)).toThrow();
  });
  
  it('should fail with wrong nonce length', () => {
    const payload = { amount: 100 };
    const encrypted = envelopeEncrypt(payload);
    
    // Use invalid nonce (too short)
    encrypted.payload_nonce = 'short';
    
    expect(() => envelopeDecrypt(encrypted)).toThrow('Nonce must be 12 bytes');
  });
  
  it('should generate different nonces each time', () => {
    const payload = { test: 'data' };
    
    const enc1 = envelopeEncrypt(payload);
    const enc2 = envelopeEncrypt(payload);
    
    // Even with same payload, nonces should be random
    expect(enc1.payload_nonce).not.toBe(enc2.payload_nonce);
    expect(enc1.dek_wrap_nonce).not.toBe(enc2.dek_wrap_nonce);
  });
  
  it('should handle complex nested payloads', () => {
    const payload = {
      user: {
        id: 123,
        name: 'Test User',
        metadata: {
          tags: ['vip', 'premium'],
          score: 95.5
        }
      },
      timestamp: '2026-02-12T10:00:00Z'
    };
    
    const encrypted = envelopeEncrypt(payload);
    const decrypted = envelopeDecrypt(encrypted);
    
    expect(decrypted).toEqual(payload);
  });
  
  it('should fail with tampered DEK wrapper', () => {
    const payload = { secret: 'data' };
    const encrypted = envelopeEncrypt(payload);
    
    // Tamper with wrapped DEK
    encrypted.dek_wrapped = 'ff00ff00ff00ff00ff00ff00ff00ff00';
    
    expect(() => envelopeDecrypt(encrypted)).toThrow();
  });
});
