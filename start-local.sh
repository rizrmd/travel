#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Travel Umroh Local Environment...${NC}"

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed and is required for the database.${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker daemon is not running.${NC}"
    exit 1
fi

# 1. Start Infrastructure (Postgres + Redis)
echo -e "${BLUE}📦 Starting Database and Redis...${NC}"
docker compose up -d postgres redis

# Wait for DB readiness
echo -e "${BLUE}⏳ Waiting for Database to be ready...${NC}"
until docker exec travel_umroh_postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo -e "${GREEN}✅ Database is ready!${NC}"

# 2. Setup Backend
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

# 3. Setup Frontend
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
    # Optional: Stop docker containers
    # docker-compose down
    echo -e "${GREEN}✅ Shutdown complete. (Docker containers left running for faster restart)${NC}"
    exit
}

trap cleanup SIGINT SIGTERM

# Start Frontend
echo -e "${GREEN}✅ Environment Ready!${NC}"
echo -e "${GREEN}Backend: http://localhost:3000/api${NC}"
echo -e "${GREEN}Frontend: Starting now...${NC}"

PORT=3001 npm run dev

