#!/bin/bash
# API Testing Script

API_URL="http://localhost:3002"

echo "🧪 Testing Secure Transactions API"
echo "===================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
HEALTH=$(curl -s $API_URL/health)
echo "   Response: $HEALTH"
echo ""

# Test 2: Encrypt Transaction
echo "2️⃣  Testing Encryption..."
ENCRYPT_RESPONSE=$(curl -s -X POST $API_URL/tx/encrypt \
  -H "Content-Type: application/json" \
  -d '{"partyId": "party_test", "payload": {"amount": 500, "currency": "AED"}}')
TX_ID=$(echo $ENCRYPT_RESPONSE | jq -r '.id')
echo "   Created transaction: $TX_ID"
echo "   Algorithm: $(echo $ENCRYPT_RESPONSE | jq -r '.alg')"
echo ""

# Test 3: Fetch Encrypted Record
echo "3️⃣  Testing Fetch..."
FETCH_RESPONSE=$(curl -s $API_URL/tx/$TX_ID)
echo "   Party ID: $(echo $FETCH_RESPONSE | jq -r '.partyId')"
echo "   Nonce length: $(echo $FETCH_RESPONSE | jq -r '.payload_nonce' | wc -c)"
echo ""

# Test 4: Decrypt Transaction
echo "4️⃣  Testing Decryption..."
DECRYPT_RESPONSE=$(curl -s -X POST $API_URL/tx/$TX_ID/decrypt)
echo "   Decrypted Payload: $(echo $DECRYPT_RESPONSE | jq -r '.payload')"
echo ""

# Test 5: List All Transactions
echo "5️⃣  Testing List..."
LIST_RESPONSE=$(curl -s $API_URL/tx)
echo "   Total transactions: $(echo $LIST_RESPONSE | jq -r '.count')"
echo ""

# Test 6: Error Handling
echo "6️⃣  Testing Error Handling..."
ERROR_RESPONSE=$(curl -s $API_URL/tx/nonexistent)
echo "   404 Error: $(echo $ERROR_RESPONSE | jq -r '.error')"
echo ""

echo "✅ All tests completed!"
