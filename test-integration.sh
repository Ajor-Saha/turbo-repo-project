#!/bin/bash
# Frontend-Backend Integration Test

echo "🧪 Testing Frontend-Backend Integration"
echo "========================================"
echo ""

# Check if API is running
echo "1️⃣  Checking API server..."
API_HEALTH=$(curl -s http://localhost:3002/health | jq -r '.status' 2>/dev/null)
if [ "$API_HEALTH" = "ok" ]; then
    echo "   ✅ API server is running"
else
    echo "   ❌ API server is not responding"
    exit 1
fi
echo ""

# Check if Frontend is running
echo "2️⃣  Checking Frontend server..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend server is running"
else
    echo "   ❌ Frontend server is not responding (Status: $FRONTEND_STATUS)"
    exit 1
fi
echo ""

# Test encryption via API
echo "3️⃣  Testing encryption flow..."
ENCRYPT_RESULT=$(curl -s -X POST http://localhost:3002/tx/encrypt \
  -H "Content-Type: application/json" \
  -d '{"partyId": "integration_test", "payload": {"test": "frontend-backend", "timestamp": "2026-02-12"}}')

TX_ID=$(echo $ENCRYPT_RESULT | jq -r '.id')
if [ -n "$TX_ID" ] && [ "$TX_ID" != "null" ]; then
    echo "   ✅ Transaction created: $TX_ID"
else
    echo "   ❌ Encryption failed"
    echo "   Response: $ENCRYPT_RESULT"
    exit 1
fi
echo ""

# Test decryption via API
echo "4️⃣  Testing decryption flow..."
DECRYPT_RESULT=$(curl -s -X POST http://localhost:3002/tx/$TX_ID/decrypt)
DECRYPTED_TEST=$(echo $DECRYPT_RESULT | jq -r '.payload.test')

if [ "$DECRYPTED_TEST" = "frontend-backend" ]; then
    echo "   ✅ Decryption successful"
    echo "   Original payload restored correctly"
else
    echo "   ❌ Decryption failed"
    echo "   Response: $DECRYPT_RESULT"
    exit 1
fi
echo ""

# Summary
echo "✅ All integration tests passed!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:3002"
echo "📝 Transaction ID: $TX_ID"
echo ""
echo "To test the UI:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Enter a party ID and JSON payload"
echo "3. Click 'Encrypt & Save'"
echo "4. Use the returned ID to fetch or decrypt"
