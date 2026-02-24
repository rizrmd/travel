#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Travel Umroh Local Environment...${NC}"
echo -e "${BLUE}ℹ️  Using external PostgreSQL and Redis from your .env file.${NC}"

# 1. Setup Backend
echo -e "${BLUE}🔧 Setting up Backend...${NC}"

# Create .env if missing
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env from .env.example...${NC}"
    cp .env.example .env
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    npm install
fi

# Run Migrations
echo -e "${BLUE}🔄 Running Database Migrations...${NC}"
npm run migration:run

# Start Backend in background
echo -e "${BLUE}🚀 Starting Backend API...${NC}"
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# 2. Setup Frontend
echo -e "${BLUE}🎨 Setting up Frontend...${NC}"
cd frontend

# Create .env.local if missing
if [ ! -f .env.local ]; then
    echo -e "${BLUE}Creating .env.local from .env.local.example...${NC}"
    cp .env.local.example .env.local
fi

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
fi

# Cleanup function
cleanup() {
    echo -e "\n${BLUE}🛑 Shutting down...${NC}"
    kill $BACKEND_PID
    cd ..
    echo -e "${GREEN}✅ Shutdown complete.${NC}"
    exit
}

trap cleanup SIGINT SIGTERM

# Start Frontend
echo -e "${GREEN}✅ Environment Ready!${NC}"
echo -e "${GREEN}Backend: http://localhost:3000/api${NC}"
echo -e "${GREEN}Frontend: Starting now...${NC}"

PORT=3002 npm run dev
