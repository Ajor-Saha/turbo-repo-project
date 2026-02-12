#!/bin/bash
# Start both API and Web servers

echo "🚀 Starting Secure Transactions Project"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the project root"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

echo "🔧 Starting servers..."
echo ""

# Start API in background
echo "Starting API server (port 3002)..."
cd apps/api && pnpm dev &
API_PID=$!

# Wait a bit for API to start
sleep 3

# Start Web in background  
echo "Starting Web server (port 3000)..."
cd ../web && pnpm dev &
WEB_PID=$!

echo ""
echo "✅ Servers starting..."
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:3002"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $API_PID $WEB_PID
