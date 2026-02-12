# 🔐 Secure Transactions Mini-App

> Mirfa Software Engineer Intern Challenge - AES-256-GCM Envelope Encryption

A production-ready monorepo for secure transaction encryption using **TurboRepo**, **Fastify**, and **Next.js**.

## 🏗️ Project Structure

```
my-turbo-project/
├── apps/
│   ├── api/              # Fastify backend (port 3002)
│   │   ├── src/          # Source code
│   │   ├── dist/         # Compiled JavaScript
│   │   ├── build.sh      # Build script
│   │   └── index.js      # Vercel handler
│   └── web/              # Next.js frontend (port 3000)
│       ├── app/          # Next.js app directory
│       ├── lib/          # API client & utilities
│       └── types/        # TypeScript definitions
├── packages/
│   ├── crypto/           # AES-256-GCM encryption library
│   │   ├── src/          # Encryption/decryption logic
│   │   └── dist/         # Compiled output
│   ├── ui/               # Shared UI components
│   └── typescript-config/ # Shared TS configs
├── docs/                 # All documentation
│   ├── README.md         # Challenge details
│   ├── DEPLOYMENT.md     # Deployment guide
│   ├── CHECKLIST.md      # Submission checklist
│   └── LOOM_GUIDE.md     # Video recording guide
├── scripts/              # Build & test scripts
│   ├── test-integration.sh
│   ├── test-build.sh
│   └── verify-deployment.sh
├── start.sh              # Quick start script
└── turbo.json            # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+

### Install & Run

```bash
# Install dependencies
pnpm install

# Start all apps (Turbo will handle everything)
pnpm dev

# Or use the start script
./start.sh
```

**Access:**
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3002

### Run Tests

```bash
# Run all tests
pnpm test

# Run crypto package tests only
cd packages/crypto && pnpm test
```

## 🔐 How It Works

### Envelope Encryption (AES-256-GCM)

1. **Generate** random 32-byte DEK (Data Encryption Key)
2. **Encrypt** payload with DEK using AES-256-GCM
3. **Wrap** DEK with Master Key using AES-256-GCM
4. **Store** encrypted payload + wrapped DEK + nonces + auth tags

**Decryption reverses the process:**
1. Unwrap DEK using Master Key
2. Decrypt payload using DEK
3. Return original JSON

### Data Model

```typescript
type TxSecureRecord = {
  id: string
  partyId: string
  createdAt: string
  
  // Payload encrypted with DEK
  payload_nonce: string   // 12 bytes (24 hex)
  payload_ct: string      // variable length
  payload_tag: string     // 16 bytes (32 hex)
  
  // DEK wrapped with Master Key
  dek_wrap_nonce: string  // 12 bytes (24 hex)
  dek_wrapped: string     // 64 hex chars
  dek_wrap_tag: string    // 16 bytes (32 hex)
  
  alg: "AES-256-GCM"
  mk_version: 1
}
```

## 📡 API Endpoints

### `POST /tx/encrypt`
Encrypts and stores a transaction.

**Request:**
```json
{
  "partyId": "party_123",
  "payload": {"amount": 100, "currency": "AED"}
}
```

**Response:** Complete encrypted record

### `GET /tx/:id`
Retrieves encrypted record (no decryption).

### `POST /tx/:id/decrypt`
Decrypts and returns original payload.

**Response:**
```json
{
  "id": "...",
  "partyId": "party_123",
  "payload": {"amount": 100, "currency": "AED"}
}
```

## 🧪 Testing

**14 tests implemented** (exceeds minimum requirement of 5):

✅ Encryption/Decryption tests (7):
- Encrypt → decrypt round-trip
- Tampered ciphertext detection
- Tampered tag detection  
- Invalid nonce length rejection
- Random nonce generation
- Complex nested payloads
- DEK wrapper tampering

✅ Validation tests (7):
- Hex string validation
- Invalid length detection
- Non-hex character rejection
- Complete record validation
- Multiple error reporting

**Run tests:**
```bash
cd packages/crypto && pnpm test
```

## 🎯 Validation Rules

The system rejects decryption if:
- ❌ Nonce is not 12 bytes
- ❌ Tag is not 16 bytes
- ❌ Invalid hex characters
- ❌ Ciphertext tampered
- ❌ Tag tampered
- ❌ Decryption fails (authentication error)

## 🚀 Deployment to Vercel

### 1. Deploy API

```bash
cd apps/api
vercel --prod
```

Set environment variable:
- `MASTER_KEY_HEX` = 64-character hex string (32 bytes)

### 2. Deploy Web

```bash
cd apps/web
vercel --prod
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` = your deployed API URL

### Environment Variables

**API (.env):**
```env
PORT=3002
MASTER_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
FRONTEND_URL=http://localhost:3000
```

**Web (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## 🏛️ Architecture

### Monorepo Structure
- **TurboRepo** manages builds and dev servers
- **Shared packages** for crypto logic and configs
- **TypeScript** across all packages
- **pnpm workspaces** for dependency management

### Security Features
- ✅ Envelope encryption for key rotation
- ✅ GCM mode for authenticated encryption
- ✅ Random nonces (never reused)
- ✅ Validation before decryption
- ✅ Hex encoding for storage
- ✅ Master key from environment

## 📦 Tech Stack

- **Monorepo:** TurboRepo
- **Backend:** Fastify 5
- **Frontend:** Next.js 15 + React 19
- **Crypto:** Node.js crypto (AES-256-GCM)
- **Testing:** Vitest
- **Language:** TypeScript 5
- **Package Manager:** pnpm
- **Deployment:** Vercel

## 🎨 Features

### Frontend
- Real-time JSON validation
- Encrypt transactions
- Fetch encrypted records
- Decrypt payloads
- Error handling
- Dark theme UI

### Backend  
- Fast API with Fastify
- In-memory storage
- Comprehensive logging
- CORS enabled
- Error handling
- Type-safe

### Crypto Package
- Envelope encryption
- Validation utilities
- Type definitions
- Fully tested
- Reusable across apps

## 📚 Scripts

```bash
# Development
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm test         # Run all tests

# Individual apps
cd apps/api && pnpm dev      # API only
cd apps/web && pnpm dev      # Web only

# Testing
./scripts/test-integration.sh        # Full integration test
cd apps/api && ./test-api.sh # API tests
```

## 🐛 Known Issues & Solutions

### Port Already in Use
```bash
# Kill processes on ports 3000 and 3002
lsof -ti:3000 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Master Key Not Found
Ensure `.env` file exists in `apps/api/` with `MASTER_KEY_HEX`

## 🔧 Development

### Adding a New Package
```bash
cd packages
mkdir my-package
cd my-package
pnpm init
```

Update `pnpm-workspace.yaml` if needed.

### Using the Crypto Package
```typescript
import { envelopeEncrypt, envelopeDecrypt } from '@repo/crypto/index';

const encrypted = envelopeEncrypt({ data: 'secret' });
const decrypted = envelopeDecrypt(encrypted);
```

## 📖 Documentation

- **API:** [apps/api/README.md](apps/api/README.md)
- **Web:** [apps/web/README.md](apps/web/README.md)
- **Deployment Guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Loom Guide:** [docs/LOOM_GUIDE.md](docs/LOOM_GUIDE.md)
- **Checklist:** [docs/CHECKLIST.md](docs/CHECKLIST.md)
- **Challenge Details:** [docs/README.md](docs/README.md)

## ✅ Submission Checklist

Before submitting:
- [ ] Tests pass (`pnpm test`)
- [ ] Integration test passes (`./scripts/test-integration.sh`)
- [ ] API deployed to Vercel
- [ ] Web deployed to Vercel
- [ ] Both URLs working
- [ ] GitHub repo created & pushed
- [ ] Loom video recorded (3-6 min)
- [ ] Form submitted: https://forms.gle/YeGkQdRGQCZcKG3g7

See [docs/CHECKLIST.md](docs/CHECKLIST.md) for detailed checklist.

## 👥 Author

Built for the Mirfa Software Engineer Intern Challenge

## 📄 License

MIT

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
