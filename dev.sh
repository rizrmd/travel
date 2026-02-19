#!/bin/bash

# Travel Umroh Frontend Development Script
# Runs Next.js development server with auto-cleanup

# Note: NOT using 'set -e' to allow graceful error handling

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# PID file location
NEXTJS_PID_FILE=".nextjs.pid"

# Default port
NEXTJS_PORT=3000

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_highlight() {
    echo -e "${CYAN}[HIGHLIGHT]${NC} $1"
}

# Cleanup function
cleanup() {
    print_status "Stopping all services..."

    # Kill Next.js process
    if [ -f "$NEXTJS_PID_FILE" ]; then
        NEXTJS_PID=$(cat "$NEXTJS_PID_FILE")
        if kill -0 "$NEXTJS_PID" 2>/dev/null; then
            kill "$NEXTJS_PID" 2>/dev/null || true
            print_success "Next.js server stopped"
        fi
        rm -f "$NEXTJS_PID_FILE"
    fi

    # Kill any remaining Next.js processes
    pkill -f "next dev" 2>/dev/null || true

    print_success "All services stopped"
    exit 0
}

# Set trap for cleanup (only on INT and TERM, not EXIT)
trap cleanup INT TERM

# Auto-detect and switch to frontend directory if needed
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "package.json" ] || [ ! -d "app" ]; then
    # We're probably in the root directory, check if frontend/ exists
    if [ -d "$SCRIPT_DIR/frontend" ] && [ -f "$SCRIPT_DIR/frontend/package.json" ]; then
        print_status "Detected root directory, switching to frontend/"
        cd "$SCRIPT_DIR/frontend" || exit 1
        print_success "Changed to frontend directory"
    else
        print_error "Could not find frontend directory with package.json and app/"
        print_status "Expected: frontend/package.json and frontend/app/"
        exit 1
    fi
fi

echo ""
echo "🕌 Travel Umroh Frontend Development Environment"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20+ first: https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ required. Current version: $(node -v)"
    print_status "Please upgrade Node.js: https://nodejs.org"
    exit 1
fi

print_success "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js with npm: https://nodejs.org"
    exit 1
fi

print_success "npm $(npm -v) detected"

# Kill any processes on required ports
print_status "Cleaning up ports..."

# Kill all Next.js dev processes that might be running
print_status "Stopping any existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Kill processes on Next.js port
if lsof -ti:$NEXTJS_PORT > /dev/null 2>&1; then
    print_warning "Port $NEXTJS_PORT is in use, killing process..."
    lsof -ti:$NEXTJS_PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

print_success "All ports cleaned up"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found"
    print_status "Installing dependencies with npm..."
    npm install

    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "node_modules already exists"

    # Check if package-lock.json is newer than node_modules
    if [ "package.json" -nt "node_modules" ]; then
        print_warning "package.json is newer than node_modules"
        print_status "Running npm install to update dependencies..."
        npm install
    fi
fi

# Check if .env.local exists (optional for this project)
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        print_warning ".env.local not found (optional for now)"
        print_status "You can create .env.local from .env.example if needed:"
        print_status "  cp .env.example .env.local"
        echo ""
    fi
else
    print_success ".env.local found"
fi

# Verify build can work (optional quick check)
print_status "Verifying TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    print_success "TypeScript config found"
else
    print_warning "tsconfig.json not found"
fi

# Create .next directory if it doesn't exist
mkdir -p .next

# Start Next.js Development Server
print_status "Starting Next.js development server on port $NEXTJS_PORT..."

# Start Next.js in background, redirect output to log file
npm run dev > nextjs.log 2>&1 &
NEXTJS_PID=$!
echo $NEXTJS_PID > "$NEXTJS_PID_FILE"

print_success "Next.js started (PID: $NEXTJS_PID)"

# Give it a moment to write initial logs
sleep 3

# Wait for Next.js to be ready
print_status "Waiting for Next.js to be ready..."
READY=0
for i in {1..60}; do
    # Check if process is still running
    if ! kill -0 "$NEXTJS_PID" 2>/dev/null; then
        print_error "Next.js process died. Check nextjs.log for errors."
        echo ""
        print_status "Last 30 lines of nextjs.log:"
        tail -30 nextjs.log
        exit 1
    fi

    # Check if port is listening
    if lsof -ti:$NEXTJS_PORT > /dev/null 2>&1; then
        print_success "Next.js is listening on port $NEXTJS_PORT"
        READY=1
        break
    fi

    # Also check for "Ready in" message in logs
    if grep -q "Ready in" nextjs.log 2>/dev/null; then
        print_success "Next.js compilation complete"
        READY=1
        break
    fi

    # Check for "compiled successfully" message
    if grep -q "Compiled" nextjs.log 2>/dev/null; then
        print_success "Next.js compiled successfully"
        READY=1
        break
    fi

    sleep 1
done

if [ $READY -eq 0 ]; then
    print_error "Next.js failed to become ready within 60 seconds."
    echo ""
    print_status "Last 30 lines of nextjs.log:"
    tail -30 nextjs.log
    exit 1
fi

# Get local IP for network access
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Display access information
echo ""
echo "=================================================================="
echo "🕌 Travel Umroh Frontend Development Environment Ready!"
echo "=================================================================="
echo ""
echo "🌐 Application URLs:"
echo "   ${GREEN}Local:${NC}    http://localhost:$NEXTJS_PORT"
echo "   ${GREEN}Network:${NC}  http://$LOCAL_IP:$NEXTJS_PORT"
echo ""
echo "📱 Mobile Testing:"
echo "   Use Network URL on your phone/tablet (same WiFi)"
echo ""
echo "📄 Available Pages:"
echo "   ${CYAN}Homepage:${NC}              /"
echo "   ${CYAN}Test Density:${NC}          /test-density"
echo "   ${CYAN}Analytics:${NC}             /owner/analytics"
echo "   ${CYAN}Analytics (Density):${NC}   /owner/analytics-density"
echo "   ${CYAN}Landing Builder:${NC}       /agent/landing-builder"
echo "   ${CYAN}Landing Editor:${NC}        /agent/landing-builder/editor"
echo "   ${CYAN}Landing Preview:${NC}       /agent/landing-builder/preview"
echo ""
echo "🎨 Key Features:"
echo "   ${MAGENTA}✓${NC} 11 Epics Implemented (Design System → Density Modes)"
echo "   ${MAGENTA}✓${NC} Responsive Layout (Mobile-first)"
echo "   ${MAGENTA}✓${NC} Adaptive Density (Compact/Comfortable/Spacious)"
echo "   ${MAGENTA}✓${NC} Analytics Dashboard with Charts"
echo "   ${MAGENTA}✓${NC} Landing Page Builder"
echo "   ${MAGENTA}✓${NC} Indonesian Language UI"
echo ""
echo "📊 Tech Stack:"
echo "   ${BLUE}Framework:${NC}    Next.js 14.2 (App Router)"
echo "   ${BLUE}Language:${NC}     TypeScript 5.4"
echo "   ${BLUE}Styling:${NC}      Tailwind CSS 3.4 + shadcn/ui"
echo "   ${BLUE}Charts:${NC}       Recharts"
echo "   ${BLUE}Forms:${NC}        React Hook Form + Zod"
echo ""
echo "📝 Logs:"
echo "   Next.js:  tail -f nextjs.log"
echo ""
echo "🛠️  Commands:"
echo "   ${YELLOW}Stop:${NC}         Press Ctrl+C"
echo "   ${YELLOW}Restart:${NC}      Stop and run ./dev.sh again"
echo "   ${YELLOW}View logs:${NC}    tail -f nextjs.log"
echo "   ${YELLOW}Clear cache:${NC}  rm -rf .next"
echo "   ${YELLOW}Reinstall:${NC}    rm -rf node_modules && npm install"
echo ""
echo "🧪 Quick Testing Guide:"
echo "   1. Open ${CYAN}http://localhost:$NEXTJS_PORT/test-density${NC}"
echo "   2. Click density toggle in navigation bar (top-right)"
echo "   3. Switch modes: Padat → Nyaman → Lapang"
echo "   4. Navigate to ${CYAN}/owner/analytics${NC} to see charts"
echo "   5. Try ${CYAN}/agent/landing-builder${NC} for template gallery"
echo "   6. Resize browser to test responsive layout"
echo ""
echo "📚 Documentation:"
echo "   README.md         - Full project documentation"
echo "   TESTING-GUIDE.md  - Complete testing checklist"
echo "   .env.example      - Environment variables template"
echo ""
echo "⚠️  Note:"
echo "   ${YELLOW}•${NC} All data is currently MOCK/STATIC (no backend yet)"
echo "   ${YELLOW}•${NC} Authentication not implemented (all pages accessible)"
echo "   ${YELLOW}•${NC} Changes auto-reload with Next.js Fast Refresh"
echo ""
echo "=================================================================="

print_success "Development environment is running!"
print_status "Press Ctrl+C to stop all services"
echo ""

# Try to open browser automatically (optional, only on Linux with xdg-open)
if command -v xdg-open &> /dev/null; then
    print_status "Opening browser in 3 seconds... (Ctrl+C to cancel)"
    sleep 3
    xdg-open "http://localhost:$NEXTJS_PORT/test-density" 2>/dev/null &
fi

# Follow logs
tail -f nextjs.log
