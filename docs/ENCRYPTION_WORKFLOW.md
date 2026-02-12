# 🔐 Encryption & Decryption Workflow

This document explains the AES-256-GCM envelope encryption and decryption processes used in the Secure Transactions system.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Encryption Process](#encryption-process)
- [Decryption Process](#decryption-process)
- [Data Structure](#data-structure)
- [Security & Algorithm Details](#security--algorithm-details)

---

## System Architecture

The system consists of five main components:

- **Client Application**: Web interface for user interaction
- **Fastify API Server**: REST API with encryption/decryption endpoints
- **Crypto Package**: Reusable encryption library implementing envelope encryption
- **Storage Layer**: In-memory storage for encrypted records
- **Environment Secrets**: Master Key (256-bit) stored securely



**Component Interactions:**

1. Client sends request to API Router
2. Router directs to appropriate endpoint (encrypt/decrypt/fetch)
3. Endpoints use Crypto Package for encryption operations
4. Crypto Package manages DEKs and validates data
5. Key Management accesses Master Key from environment
6. Encrypted records stored in Memory Storage

---

## Encryption Process

### Step-by-Step Flow


**Process:**

1. **Receive Input** - Client sends `partyId` and `payload` (JSON object)

2. **Generate DEK** - Create random 256-bit Data Encryption Key (32 bytes)

3. **Generate Nonce 1** - Create random 12-byte nonce for payload encryption

4. **Encrypt Payload** - Use AES-256-GCM to encrypt payload with DEK
   - Output: Ciphertext, Authentication Tag (16 bytes), Nonce (12 bytes)

5. **Load Master Key** - Retrieve 256-bit Master Key from environment variable

6. **Generate Nonce 2** - Create random 12-byte nonce for DEK wrapping

7. **Wrap DEK** - Use AES-256-GCM to encrypt DEK with Master Key
   - Output: Wrapped DEK, Authentication Tag (16 bytes), Nonce (12 bytes)

8. **Hex Encode** - Convert all binary data to hexadecimal strings

9. **Create Record** - Generate unique ID (nanoid) and create `TxSecureRecord`

10. **Store** - Save encrypted record in memory storage

11. **Response** - Return only `id`, `partyId`, and `createdAt` to client

**Key Points:**
- Original payload is never stored in plain text
- DEK is unique per transaction and never stored in plain form
- Master Key is never stored in the database, only in environment
- Random nonces ensure unique ciphertext even for identical payloads

---

## Decryption Process

### Step-by-Step Flow



**Process:**

1. **Receive Request** - Client sends transaction ID

2. **Fetch Record** - Retrieve encrypted record from storage
   - If not found: Return 404 Not Found

3. **Validate Structure** - Verify record integrity
   - Check all required fields present
   - Validate hex strings (only 0-9, a-f characters)
   - Verify nonce length = 12 bytes (24 hex chars)
   - Verify tag length = 16 bytes (32 hex chars)
   - If invalid: Return 400 Bad Request with error details

4. **Hex Decode** - Convert hex strings back to binary buffers

5. **Load Master Key** - Retrieve 256-bit Master Key from environment

6. **Unwrap DEK** - Use AES-256-GCM to decrypt wrapped DEK with Master Key
   - Verify authentication tag
   - If unwrap fails: Return 500 Internal Error (tampered or wrong key)

7. **DEK Recovered** - Now have the original 32-byte DEK

8. **Decrypt Payload** - Use AES-256-GCM to decrypt payload with DEK
   - Verify authentication tag
   - If decryption fails: Return 500 Internal Error (tampered data)

9. **Parse JSON** - Convert decrypted string to JSON object

10. **Response** - Return `id`, `partyId`, and original `payload` to client

**Key Points:**
- Multi-layer validation before attempting decryption
- Authentication tags prevent tampered data from being decrypted
- Master Key must match the one used for encryption
- Original payload is restored exactly as it was encrypted

---

## Security & Algorithm Details

### AES-256-GCM Specifications

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **Algorithm** | AES-256-GCM | Authenticated encryption |
| **Key Size** | 256 bits (32 bytes) | Maximum AES security |
| **Nonce Size** | 96 bits (12 bytes) | GCM recommended size |
| **Tag Size** | 128 bits (16 bytes) | Authentication tag |
| **Mode** | GCM (Galois/Counter) | Confidentiality + Authenticity |

### Security Features

**Multi-Layer Protection:**

1. **Input Validation**
   - Schema validation
   - Type checking
   - Size limits (1MB max payload)

2. **Encryption Layer**
   - AES-256-GCM authenticated encryption
   - Random nonces (never reused)
   - Authentication tags detect tampering

3. **Key Management**
   - Envelope encryption (2-layer security)
   - Master Key in environment only
   - Unique DEK per transaction

4. **Storage Security**
   - No plain data stored
   - Hex-encoded format
   - Metadata-only exposure

5. **Validation Before Decryption**
   - Hex string validation
   - Length verification
   - Authentication tag checks

### Threat Protection

| Threat | Protection |
|--------|-----------|
| **Data Breach** | AES-256-GCM encryption at rest |
| **Tampering** | Authentication tags detect modifications |
| **Key Exposure** | DEKs wrapped, Master Key in environment only |
| **Replay Attacks** | Random nonces ensure uniqueness |
| **Weak Keys** | 256-bit cryptographically random keys |
| **Key Rotation** | Envelope pattern allows easy Master Key updates |

### Why Envelope Encryption?

**Benefits:**

- **Security**: Multiple encryption layers
- **Key Management**: Easy to rotate Master Key without re-encrypting all data
- **Performance**: Fast symmetric encryption (AES)
- **Scalability**: Each transaction has isolated keys
- **Flexibility**: Can upgrade encryption without data migration

**Process:**
1. Encrypt data with DEK (fast, per-transaction)
2. Encrypt DEK with Master Key (adds protection layer)
3. Master Key rotation: Only need to re-wrap DEKs, not re-encrypt data

---

## Performance

**Time Complexity:** O(n) where n = payload size

- Generate DEK: O(1) - constant
- Encrypt Payload: O(n) - linear with data size
- Wrap DEK: O(1) - constant (32 bytes)
- Hex Encoding: O(n) - linear with data size

**Body Limit:** 1MB maximum payload size

---

## Summary

This system implements **defense-in-depth** security:

✅ AES-256-GCM authenticated encryption  
✅ Unique DEK per transaction  
✅ Master Key never stored in database  
✅ Authentication tags prevent tampering  
✅ Random nonces prevent replay attacks  
✅ Multi-layer validation  
✅ Easy key rotation via envelope pattern  


