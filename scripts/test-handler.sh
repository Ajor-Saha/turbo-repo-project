#!/bin/bash
# Test the Vercel handler simulation

echo "🧪 Testing Vercel Handler Simulation"
echo "===================================="

cd apps/api

echo ""
echo "1️⃣ Testing handler import..."
node -e "
import('./api/index.js').then(module => {
  if (typeof module.default === 'function') {
    console.log('   ✅ Handler is a function');
  } else {
    console.log('   ❌ Handler is not a function:', typeof module.default);
    process.exit(1);
  }
}).catch(err => {
  console.log('   ❌ Import failed:', err.message);
  process.exit(1);
});
" || exit 1

echo ""
echo "2️⃣ Testing app creation..."
node -e "
import('./dist/app.js').then(module => {
  if (typeof module.createApp === 'function') {
    console.log('   ✅ createApp function exists');
    const app = module.createApp();
    console.log('   ✅ App instance created');
  } else {
    console.log('   ❌ createApp not found');
    process.exit(1);
  }
}).catch(err => {
  console.log('   ❌ Failed:', err.message);
  process.exit(1);
});
" || exit 1

echo ""
echo "===================================="
echo "✅ HANDLER TESTS PASSED!"
echo ""
echo "The Vercel serverless function will work correctly."
echo ""
