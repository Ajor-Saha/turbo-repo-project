#!/bin/bash
# Complete verification for Vercel deployment

echo "🔍 Complete Deployment Verification"
echo "===================================="

cd apps/api

echo ""
echo "1️⃣ Checking structure..."
if [ -f "index.js" ] && [ -f "dist/app.js" ] && [ -f "vercel.json" ]; then
    echo "   ✅ Required files present"
else
    echo "   ❌ Missing files"
    exit 1
fi

echo ""
echo "2️⃣ Testing handler..."
node -e "
import('./index.js').then(module => {
  if (typeof module.default === 'function') {
    console.log('   ✅ Handler exports function');
  } else {
    console.log('   ❌ Invalid export');
    process.exit(1);
  }
}).catch(err => {
  console.log('   ❌ Import failed:', err.message);
  process.exit(1);
});
" || exit 1

echo ""
echo "3️⃣ Testing app creation..."
node -e "
import('./dist/app.js').then(({ createApp }) => {
  const app = createApp();
  if (app && app.ready) {
    console.log('   ✅ App creates successfully');
    return app.ready();
  } else {
    console.log('   ❌ App creation failed');
    process.exit(1);
  }
}).then(() => {
  console.log('   ✅ App ready');
  process.exit(0);
}).catch(err => {
  console.log('   ❌ Error:', err.message);
  process.exit(1);
});
" || exit 1

echo ""
echo "4️⃣ Checking imports..."
if grep -q "from './dist/app.js'" index.js; then
    echo "   ✅ Correct import path"
else
    echo "   ❌ Wrong import path"
    exit 1
fi

echo ""
echo "5️⃣ Checking vercel.json..."
if grep -q '"src": "index.js"' vercel.json; then
    echo "   ✅ Vercel config correct"
else  
    echo "   ❌ Vercel config wrong"
    exit 1
fi

cd ../..

echo ""
echo "===================================="
echo "✅ ALL VERIFICATIONS PASSED!"
echo ""
echo "Structure:"
echo "  apps/api/"
echo "    ├── index.js       (Vercel handler)"
echo "    ├── dist/app.js    (Compiled app)"
echo "    └── vercel.json    (Config)"
echo ""
echo "Ready to deploy!"
echo ""
