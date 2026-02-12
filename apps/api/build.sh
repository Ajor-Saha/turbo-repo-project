#!/bin/bash
set -e

echo "🔨 Building API for Vercel..."

# Go to monorepo root
cd ../..

# Build the packages
echo "Building dependencies..."
pnpm turbo build --filter=api

# Verify build
echo ""
echo "Verifying build output..."
if [ ! -d "apps/api/dist" ]; then
  echo "❌ ERROR: apps/api/dist not created!"
  exit 1
fi

if [ ! -f "apps/api/dist/app.js" ]; then
  echo "❌ ERROR: apps/api/dist/app.js not found!"
  exit 1
fi

if [ ! -d "packages/crypto/dist" ]; then
  echo "❌ ERROR: packages/crypto/dist not created!"
  exit 1
fi

echo "✅ Build successful!"
echo ""
echo "Built files:"
ls -la apps/api/dist/ | head -10
echo ""
echo "Crypto files:"
ls -la packages/crypto/dist/ | head -5
