# Secure Transactions - Envelope Encryption System

A production-ready monorepo implementing AES-256-GCM envelope encryption for secure transaction management, built with TurboRepo, Fastify, and Next.js.

## Table of Contents

- [Description](#description)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start Guide](#quick-start-guide)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Description

This project provides a secure transaction encryption system using envelope encryption with AES-256-GCM algorithm. It consists of:

- **Backend API**: Fastify server handling encryption/decryption operations
- **Frontend Web**: Next.js application for user interaction
- **Crypto Package**: Reusable encryption library implementing envelope encryption pattern
- **Shared Packages**: Common UI components and TypeScript configurations

The system encrypts sensitive transaction data using a Data Encryption Key (DEK), which is then wrapped with a Master Key, ensuring secure key management and enabling key rotation without re-encrypting data.

---

## Project Structure

```
my-turbo-project/
├── apps/
│   ├── api/                      # Backend API (Fastify)
│   │   ├── src/
│   │   │   ├── app.ts           # API routes & handlers
│   │   │   ├── server.ts        # Server initialization
│   │   │   ├── storage.ts       # In-memory data storage
│   │   │   └── types.ts         # TypeScript type definitions
│   │   ├── index.js             # Vercel serverless handler
│   │   └── package.json
│   └── web/                      # Frontend (Next.js)
│       ├── app/                 # Next.js app directory
│       ├── lib/
│       │   └── api.ts           # API client utilities
│       └── types/
│           └── index.ts         # Frontend type definitions
├── packages/
│   ├── crypto/                   # Encryption library
│   │   ├── src/
│   │   │   ├── encrypt.ts       # Envelope encryption logic
│   │   │   ├── decrypt.ts       # Envelope decryption logic
│   │   │   ├── validation.ts    # Data validation utilities
│   │   │   ├── masterKey.ts     # Key management
│   │   │   └── types.ts         # Crypto type definitions
│   │   └── vitest.config.ts     # Test configuration
│   ├── ui/                       # Shared UI components
│   ├── eslint-config/           # Shared ESLint configs
│   └── typescript-config/       # Shared TypeScript configs
├── docs/                         # Project documentation
├── scripts/                      # Build & test scripts
└── turbo.json                    # TurboRepo configuration
```

---

## Tech Stack

### Core Technologies

- **Monorepo**: TurboRepo 2.8+
- **Language**: TypeScript 5.9
- **Package Manager**: pnpm 9.0

### Backend

- **Framework**: Fastify 5.2
- **CORS**: @fastify/cors 10.0
- **ID Generation**: nanoid 5.0
- **Encryption**: Node.js Crypto (built-in)

### Frontend

- **Framework**: Next.js 15
- **Runtime**: React 19
- **Styling**: CSS Modules

### Development & Testing

- **Build Tool**: TurboRepo
- **Testing**: Vitest
- **Linting**: ESLint 9
- **Type Checking**: TypeScript

### Deployment

- **Platform**: Vercel
- **API**: Vercel Serverless Functions
- **Web**: Vercel Static Hosting

---

## Quick Start Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20 or higher
- **pnpm**: v9.0 or higher

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Ajor-Saha/turbo-repo-project.git
cd turbo-repo-project
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create `.env` file in `apps/api/`:

```env
PORT=3002
MASTER_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
FRONTEND_URL=http://localhost:3000
```

> **Note**: Generate a secure 64-character hex string for `MASTER_KEY_HEX` in production.

Create `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Running Locally

**Start all applications (recommended):**

```bash
pnpm dev
```

This starts:
- Backend API on `http://localhost:3002`
- Frontend on `http://localhost:3000`

**Or start individually:**

```bash
# Backend only
pnpm --filter api dev

# Frontend only
pnpm --filter web dev
```

### Building for Production

```bash
# Build all packages
pnpm build

# Build specific app
pnpm --filter api build
pnpm --filter web build
```

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run crypto package tests (14 test cases)
cd packages/crypto
pnpm test
```

### API Integration Tests

The project includes comprehensive API integration tests that verify all endpoints are working correctly.

📄 **Test Suite**: [scripts/test-api.sh](scripts/test-api.sh)

**Test Cases Covered:**
1. ✅ Health Check - Verify API is running
2. ✅ Encrypt Transaction - Create and encrypt transaction
3. ✅ Fetch Encrypted Record - Retrieve encrypted data
4. ✅ Decrypt Transaction - Decrypt and verify payload
5. ✅ List All Transactions - Check listing functionality
6. ✅ Error Handling - Validate 404 responses

**Prerequisites:**
- API server must be running on `http://localhost:3002`
- `jq` must be installed (for JSON parsing)

**Install jq (if needed):**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

**Run API Tests:**

```bash
# Make script executable (first time only)
chmod +x scripts/test-api.sh

# Run the tests
./scripts/test-api.sh
```

**Or run from scripts directory:**

```bash
cd scripts
./test-api.sh
```

---

### Accessing the Application

- **Web Interface**: http://localhost:3000
- **API Endpoint**: http://localhost:3002
- **API Health Check**: http://localhost:3002/health

---

## API Documentation

Comprehensive API documentation is available at:

📄 [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

For visual workflow diagrams of the encryption/decryption process:

🔐 [docs/ENCRYPTION_WORKFLOW.md](docs/ENCRYPTION_WORKFLOW.md)

### Quick API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and available endpoints |
| `/health` | GET | Health check and system status |
| `/tx/encrypt` | POST | Encrypt and store a transaction |
| `/tx/:id` | GET | Retrieve encrypted transaction |
| `/tx/:id/decrypt` | POST | Decrypt a transaction |
| `/tx` | GET | List all transactions |

**Example: Encrypt a transaction**

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

## Documentation

Additional documentation is available in the `docs/` directory:

- 📖 [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference with all endpoints
- 🔐 [Encryption Workflow](docs/ENCRYPTION_WORKFLOW.md) - Workflow of encryption/decryption process
---

## License

This project is part of the Mirfa Software Engineer Intern Challenge.

