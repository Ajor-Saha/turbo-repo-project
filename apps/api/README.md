# Secure Transactions API

Fastify-based backend API for encrypting and storing transaction data using AES-256-GCM envelope encryption.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and record count.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T18:46:33.260Z",
  "records": 2
}
```

---

### Encrypt Transaction
```
POST /tx/encrypt
```
Encrypts a payload and stores it securely.

**Request:**
```json
{
  "partyId": "party_123",
  "payload": {
    "amount": 100,
    "currency": "AED"
  }
}
```

**Response:**
```json
{
  "id": "DgjZ9xUta4U9v1bfXbYzf",
  "partyId": "party_123",
  "createdAt": "2026-02-11T18:46:33.260Z",
  "payload_nonce": "c225bdedc50692afefaa7533",
  "payload_ct": "d4dcacf80939cb36860d6605596e368ac55044ceec3758a491c615e159e4ab",
  "payload_tag": "7d0eda9180c55bf03514da921fe6a85c",
  "dek_wrap_nonce": "e3c4a53ab236ea3f6b773a8c",
  "dek_wrapped": "f06c4295f11bb8b93c67a5e05a2f0e2581b1b90b098508c772b7a569f38b5b9c",
  "dek_wrap_tag": "2f81aa31549fd586ac0b73860f4ceccf",
  "alg": "AES-256-GCM",
  "mk_version": 1
}
```

---

### Fetch Encrypted Record
```
GET /tx/:id
```
Retrieves an encrypted transaction record without decrypting it.

**Response:**
```json
{
  "id": "DgjZ9xUta4U9v1bfXbYzf",
  "partyId": "party_123",
  "createdAt": "2026-02-11T18:46:33.260Z",
  "payload_nonce": "c225bdedc50692afefaa7533",
  "payload_ct": "d4dcacf80939cb36860d6605596e368ac55044ceec3758a491c615e159e4ab",
  "payload_tag": "7d0eda9180c55bf03514da921fe6a85c",
  "dek_wrap_nonce": "e3c4a53ab236ea3f6b773a8c",
  "dek_wrapped": "f06c4295f11bb8b93c67a5e05a2f0e2581b1b90b098508c772b7a569f38b5b9c",
  "dek_wrap_tag": "2f81aa31549fd586ac0b73860f4ceccf",
  "alg": "AES-256-GCM",
  "mk_version": 1
}
```

---

### Decrypt Transaction
```
POST /tx/:id/decrypt
```
Decrypts and returns the original payload.

**Response:**
```json
{
  "id": "DgjZ9xUta4U9v1bfXbYzf",
  "partyId": "party_123",
  "payload": {
    "amount": 100,
    "currency": "AED"
  }
}
```

---

### List All Transactions
```
GET /tx
```
Lists all transaction IDs (for debugging).

**Response:**
```json
{
  "count": 2,
  "transactions": [
    {
      "id": "DgjZ9xUta4U9v1bfXbYzf",
      "partyId": "party_123",
      "createdAt": "2026-02-11T18:46:33.260Z",
      "alg": "AES-256-GCM"
    }
  ]
}
```

## 🔐 Encryption

Uses **AES-256-GCM** with **envelope encryption**:

1. Generate random DEK (Data Encryption Key)
2. Encrypt payload with DEK
3. Wrap DEK with Master Key
4. Store encrypted payload + wrapped DEK

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3002
FRONTEND_URL=http://localhost:3000
MASTER_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

**Note:** The `MASTER_KEY_HEX` must be 64 hex characters (32 bytes for AES-256).

## 🧪 Testing

Run the test script:

```bash
./test-api.sh
```

Or use curl:

```bash
# Encrypt
curl -X POST http://localhost:3002/tx/encrypt \
  -H "Content-Type: application/json" \
  -d '{"partyId": "party_123", "payload": {"amount": 100, "currency": "AED"}}'

# Decrypt
curl -X POST http://localhost:3002/tx/{id}/decrypt
```

## 🏗️ Architecture

```
src/
├── index.ts      # Main server & routes
├── types.ts      # TypeScript types
└── storage.ts    # In-memory storage
```

## 📦 Dependencies

- **fastify** - Fast web framework
- **@fastify/cors** - CORS support
- **nanoid** - ID generation
- **@repo/crypto** - Encryption package (workspace)

## 🚀 Deployment

For Vercel deployment, see the main project README.
