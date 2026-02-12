# API Documentation

## Overview

The Secure Transactions API is a RESTful service that provides envelope encryption capabilities using AES-256-GCM algorithm. It allows clients to securely encrypt, store, and decrypt transaction payloads.

**Base URL:** `http://localhost:3002` (development) or your deployed URL

**Version:** 1.0.0

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Root](#get-)
  - [Health Check](#get-health)
  - [Encrypt Transaction](#post-txencrypt)
  - [Retrieve Transaction](#get-txid)
  - [Decrypt Transaction](#post-txiddecrypt)
  - [List All Transactions](#get-tx)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)

---

## Authentication

Currently, the API does not require authentication. In a production environment, you should implement:
- API keys
- JWT tokens
- OAuth 2.0

## Endpoints

### GET /

Get API information and available endpoints.

**Response:**
```json
{
  "name": "Secure Transactions API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "GET /health",
    "encrypt": "POST /tx/encrypt",
    "retrieve": "GET /tx/:id",
    "decrypt": "POST /tx/:id/decrypt",
    "list": "GET /tx"
  },
  "timestamp": "2026-02-13T10:30:00.000Z"
}
```

---

### GET /health

Health check endpoint to verify API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-13T10:30:00.000Z",
  "records": 42
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### POST /tx/encrypt

Encrypts a transaction payload using envelope encryption and stores it securely.

**Request Body:**
```json
{
  "partyId": "party-123",
  "payload": {
    "amount": 1000.50,
    "currency": "USD",
    "description": "Payment for services",
    "metadata": {
      "invoiceId": "INV-001",
      "customerId": "CUST-456"
    }
  }
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| partyId | string | Yes | Unique identifier for the party/user |
| payload | object | Yes | Any JSON-serializable object to encrypt |

**Response (201 Created):**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "partyId": "party-123",
  "createdAt": "2026-02-13T10:30:00.000Z"
}
```

**Status Codes:**
- `201 Created` - Transaction encrypted and stored successfully
- `400 Bad Request` - Invalid request body
- `500 Internal Server Error` - Encryption failed

**Example cURL:**
```bash
curl -X POST http://localhost:3002/tx/encrypt \
  -H "Content-Type: application/json" \
  -d '{
    "partyId": "party-123",
    "payload": {
      "amount": 1000.50,
      "currency": "USD"
    }
  }'
```

---

### GET /tx/:id

Retrieve an encrypted transaction record (without decrypting it).

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Transaction ID (path parameter) |

**Response (200 OK):**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "partyId": "party-123",
  "createdAt": "2026-02-13T10:30:00.000Z",
  "payload_nonce": "a1b2c3d4e5f6...",
  "payload_ct": "1a2b3c4d5e6f...",
  "payload_tag": "9z8y7x6w5v...",
  "dek_wrap_nonce": "f1e2d3c4b5a6...",
  "dek_wrapped": "6f5e4d3c2b1a...",
  "dek_wrap_tag": "5v6w7x8y9z...",
  "alg": "AES-256-GCM",
  "mk_version": 1
}
```

**Status Codes:**
- `200 OK` - Transaction found
- `404 Not Found` - Transaction not found

**Example cURL:**
```bash
curl http://localhost:3002/tx/V1StGXR8_Z5jdHi6B-myT
```

---

### POST /tx/:id/decrypt

Decrypt a transaction record and return the original payload.

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Transaction ID (path parameter) |

**Response (200 OK):**
```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "partyId": "party-123",
  "payload": {
    "amount": 1000.50,
    "currency": "USD",
    "description": "Payment for services",
    "metadata": {
      "invoiceId": "INV-001",
      "customerId": "CUST-456"
    }
  }
}
```

**Status Codes:**
- `200 OK` - Transaction decrypted successfully
- `400 Bad Request` - Invalid encrypted data structure
- `404 Not Found` - Transaction not found
- `500 Internal Server Error` - Decryption failed

**Example cURL:**
```bash
curl -X POST http://localhost:3002/tx/V1StGXR8_Z5jdHi6B-myT/decrypt
```

---

### GET /tx

List all transaction records with basic metadata (debugging endpoint).

**Response (200 OK):**
```json
{
  "count": 2,
  "transactions": [
    {
      "id": "V1StGXR8_Z5jdHi6B-myT",
      "partyId": "party-123",
      "createdAt": "2026-02-13T10:30:00.000Z",
      "alg": "AES-256-GCM"
    },
    {
      "id": "Z3QrHYF9_X2hcPj5A-abC",
      "partyId": "party-456",
      "createdAt": "2026-02-13T10:35:00.000Z",
      "alg": "AES-256-GCM"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - List retrieved successfully

**Example cURL:**
```bash
curl http://localhost:3002/tx
```

---

## Data Models

### TxSecureRecord

The encrypted transaction record stored in the system.

```typescript
{
  id: string;                  // Unique transaction ID (nanoid)
  partyId: string;             // Party/user identifier
  createdAt: string;           // ISO 8601 timestamp
  
  // Payload encrypted with DEK
  payload_nonce: string;       // Hex-encoded nonce
  payload_ct: string;          // Hex-encoded ciphertext
  payload_tag: string;         // Hex-encoded authentication tag
  
  // DEK wrapped with Master Key
  dek_wrap_nonce: string;      // Hex-encoded nonce
  dek_wrapped: string;         // Hex-encoded wrapped DEK
  dek_wrap_tag: string;        // Hex-encoded authentication tag
  
  // Algorithm metadata
  alg: "AES-256-GCM";          // Encryption algorithm
  mk_version: 1;               // Master key version
}
```

### EncryptRequest

Request body for encrypting a transaction.

```typescript
{
  partyId: string;             // Required: Party identifier
  payload: any;                // Required: JSON-serializable object
}
```

### DecryptResponse

Response from decrypting a transaction.

```typescript
{
  id: string;                  // Transaction ID
  partyId: string;             // Party identifier
  payload: any;                // Decrypted original payload
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {}  // Optional: Additional error details
}
```

### Common Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Invalid request | Missing or invalid request parameters |
| 404 | Not found | Transaction ID does not exist |
| 500 | Encryption failed | Error during encryption process |
| 500 | Decryption failed | Error during decryption process |

### Example Error Response

```json
{
  "error": "Invalid request",
  "message": "partyId is required and must be a string"
}
```

---

## Rate Limits

Currently, there are no rate limits. In production, consider implementing:
- Request throttling
- Per-IP or per-API-key limits
- Configurable limits (e.g., 100 requests/minute)

---

## Security Considerations

### Encryption Details

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Management**: Envelope encryption pattern
- **Master Key**: Stored in environment variable `MASTER_KEY_HEX`
- **DEK (Data Encryption Key)**: Generated per transaction, wrapped by master key

### Best Practices

1. **HTTPS Only**: Always use HTTPS in production
2. **Master Key**: Store in secure secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
3. **Key Rotation**: Implement master key rotation strategy
4. **Logging**: Sensitive data is never logged
5. **CORS**: Configure CORS properly for production domains
6. **Body Limits**: Max payload size is 1MB

---

## Storage

Currently using in-memory storage (Map data structure). For production:

- **Recommended**: PostgreSQL, MySQL, or MongoDB
- **Alternative**: Redis for temporary storage
- **Cloud Options**: AWS RDS, Azure SQL, Google Cloud SQL

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3002 | API server port |
| MASTER_KEY_HEX | Yes | (none) | 64-char hex string (256-bit key) |
| FRONTEND_URL | No | http://localhost:3000 | CORS allowed origin |

### Example .env

```env
PORT=3002
MASTER_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
FRONTEND_URL=http://localhost:3000
```

---

## Development

### Running Locally

```bash
# Install dependencies
pnpm install

# Start development server (with hot reload)
pnpm --filter api dev

# Build for production
pnpm --filter api build

# Start production server
pnpm --filter api start
```

### Testing

```bash
# Test encryption endpoint
curl -X POST http://localhost:3002/tx/encrypt \
  -H "Content-Type: application/json" \
  -d '{"partyId":"test","payload":{"data":"sensitive"}}'

# Test decryption endpoint (replace <ID> with actual ID)
curl -X POST http://localhost:3002/tx/<ID>/decrypt
```

---

## Troubleshooting

### Common Issues

**Issue**: `MASTER_KEY_HEX is not set`
- **Solution**: Create `.env` file in `apps/api` with valid master key

**Issue**: `CORS error in browser`
- **Solution**: Check `FRONTEND_URL` matches your frontend origin

**Issue**: `Port already in use`
- **Solution**: Change `PORT` in `.env` or kill process using port 3002

---


