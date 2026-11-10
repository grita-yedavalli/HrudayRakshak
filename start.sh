#!/bin/bash

# ==============================================================================
# BMD-HS RosaNet Diagnostics - Unified Startup Script
# ==============================================================================

# Directory anchoring
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "========================================================================"
echo " Starting BMD-HS RosaNet Cardiac Auscultation Web Application"
echo "========================================================================"

# Function to clean up background processes on Ctrl+C (SIGINT)
cleanup() {
    echo ""
    echo "Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null
    fi
    if [ ! -z "$OLLAMA_PID" ]; then
        kill "$OLLAMA_PID" 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

# 0. Check & Start Ollama if installed
echo ""
if command -v ollama >/dev/null 2>&1; then
    if curl -s http://127.0.0.1:11434 >/dev/null 2>&1; then
        echo "[0/3] 🦙 Ollama server is already running on http://127.0.0.1:11434"
    else
        echo "[0/3] 🦙 Starting local Ollama server in background..."
        ollama serve >/dev/null 2>&1 &
        OLLAMA_PID=$!
        sleep 1
    fi
else
    echo "[0/3] ℹ️ Ollama CLI not found. Using high-speed deterministic clinical RAG engine."
fi

# 1. Start FastAPI Backend
echo ""
echo "[1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt 2>/dev/null || ./venv/bin/pip install fastapi uvicorn torch numpy scipy soundfile python-multipart
fi

./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait 2 seconds for backend to initialize
sleep 2

# 2. Start Vite Frontend
echo ""
echo "[2/3] Starting React + Vite Frontend on http://localhost:5173 ..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend npm dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================================================"
echo " ✅ Application is Live!"
echo " 🌐 Frontend UI:   http://localhost:5173"
echo " ⚙️ Backend API:   http://127.0.0.1:8000"
echo " 📖 API Docs:      http://127.0.0.1:8000/docs"
echo " 🦙 Ollama LLM:    http://127.0.0.1:11434 (Auto-managed)"
echo "========================================================================"
echo "Press [CTRL+C] to stop all servers."
echo ""

# Keep script running
wait
