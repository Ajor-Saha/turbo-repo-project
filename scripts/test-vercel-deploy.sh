#!/bin/bash
# Simulate what Vercel will see after deployment

echo "🔍 Simulating Vercel Deployment Files"
echo "======================================"

cd apps/api

echo ""
echo "Files Vercel will deploy:"
echo "------------------------"

# Show what would be deployed (not ignored)
echo "Root files:"
ls -la | grep -v "node_modules" | grep -v ".turbo" | grep -v ".env" | grep -v "test-api.sh"

echo ""
echo "Dist directory:"
if [ -d "dist" ]; then
    echo "✅ dist/ exists"
    ls -la dist/ | head -10
else
    echo "❌ dist/ missing!"
    exit 1
fi

echo ""
echo "Package dependencies:"
if [ -d "../../packages/crypto/dist" ]; then
    echo "✅ crypto package dist/ exists"
fi

echo ""
echo "Import test:"
node -e "
import('./index.js').then(async (mod) => {
  console.log('✅ index.js imports');
  try {
    const { createApp } = await import('./dist/app.js');
    console.log('✅ dist/app.js accessible');
    const app = createApp();
    console.log('✅ App created');
    await app.ready();
    console.log('✅ App ready');
    process.exit(0);
  } catch (err) {
    console.log('❌ Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.log('❌ Failed to import index.js:', err.message);
  process.exit(1);
});
" || exit 1

cd ../..

echo ""
echo "======================================"
echo "✅ Deployment simulation successful!"
echo ""
