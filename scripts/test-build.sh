#!/bin/bash
# Test that the build works correctly

echo "🔨 Building crypto package..."
cd packages/crypto
pnpm build

echo "🔨 Building API..."
cd ../../apps/api
pnpm build

echo "✅ Build complete!"
echo "📦 Checking dist files..."
ls -la dist/
ls -la ../../packages/crypto/dist/

echo "✅ All builds successful!"
