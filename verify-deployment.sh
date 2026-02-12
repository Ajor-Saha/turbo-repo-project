#!/bin/bash
# Final verification before deploying to Vercel

echo "🔍 Final Deployment Verification"
echo "================================"

echo ""
echo "1️⃣ Checking crypto package has .js extensions..."
if grep -q "from './encrypt.js'" packages/crypto/dist/index.js; then
    echo "   ✅ Crypto index.js has .js extensions"
else
    echo "   ❌ Missing .js extensions in crypto"
    exit 1
fi

echo ""
echo "2️⃣ Building packages..."
pnpm turbo build --filter=api > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed"
    exit 1
fi

echo ""
echo "3️⃣ Verifying dist files exist..."
if [ -f "packages/crypto/dist/index.js" ] && [ -f "apps/api/dist/app.js" ] && [ -f "apps/api/api/index.ts" ]; then
    echo "   ✅ All required files present"
else
    echo "   ❌ Missing required files"
    exit 1
fi

echo ""
echo "4️⃣ Testing module imports..."
cd apps/api
node -e "import('./dist/app.js').then(() => process.exit(0))" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Imports work correctly"
else
    echo "   ❌ Import errors detected"
    exit 1
fi
cd ../..

echo ""
echo "================================"
echo "✅ ALL CHECKS PASSED!"
echo ""
echo "Ready to deploy! Run:"
echo "  git add ."
echo "  git commit -m 'fix: add .js extensions for ESM compatibility'"
echo "  git push"
echo ""
