#!/bin/bash

# BrokerForce Complete Setup Script
# This script sets up the entire development environment including PostgreSQL, dependencies, and environment files

set -e

echo "🚀 BrokerForce Complete Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    echo "   Please install Node.js 18+ first: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js version 18+ is recommended (found: $(node -v))${NC}"
fi

echo -e "${GREEN}✅ Node.js found: $(node -v)${NC}"
echo ""

# Check if Homebrew is installed (for PostgreSQL)
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}⚠️  Homebrew not found. PostgreSQL installation will be skipped.${NC}"
    echo "   Install Homebrew: https://brew.sh/ or install PostgreSQL manually"
    POSTGRES_AVAILABLE=false
else
    POSTGRES_AVAILABLE=true
fi

# Check/Install pnpm
USE_PNPM=false
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✅ pnpm found: $(pnpm --version)${NC}"
    USE_PNPM=true
else
    echo "📦 Attempting to install pnpm..."
    # Try global install first, fall back to npm if permission denied
    if npm install -g pnpm@8.10.0 2>/dev/null; then
        echo -e "${GREEN}✅ pnpm installed globally${NC}"
        USE_PNPM=true
    else
        echo -e "${YELLOW}⚠️  Global pnpm install failed (permission issue)${NC}"
        echo -e "${YELLOW}   Using npm instead (works just as well)${NC}"
        USE_PNPM=false
    fi
fi
echo ""

# Install root dependencies
echo "📦 Installing frontend dependencies..."
if [ "$USE_PNPM" = true ]; then
    pnpm install
else
    npm install
fi
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd google-login-demo
npm install
cd ..
echo ""

# Set up frontend environment file
if [ ! -f .env.local ] && [ ! -f .env ]; then
    echo "📝 Creating frontend .env.local from env.example..."
    cp env.example .env.local
    echo -e "${YELLOW}⚠️  Frontend .env.local created. Update with your SimplyRETS API credentials (optional)${NC}"
else
    echo -e "${GREEN}✅ Frontend environment file already exists${NC}"
fi
echo ""

# Set up backend environment file
BACKEND_ENV_EXISTS=false
if [ -f google-login-demo/.env ]; then
    BACKEND_ENV_EXISTS=true
    echo -e "${GREEN}✅ Backend environment file already exists${NC}"
else
    echo "📝 Creating backend .env from env.example..."
    cp google-login-demo/env.example google-login-demo/.env
    echo -e "${YELLOW}⚠️  Backend .env created. Update with your credentials:${NC}"
    echo "   - Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)"
    echo "   - JWT_SECRET (use the one from your notes)"
    echo "   - DATABASE_URL (will be set automatically if PostgreSQL is available)"
fi
echo ""

# PostgreSQL Setup
if [ "$POSTGRES_AVAILABLE" = true ]; then
    echo "🐘 Setting up PostgreSQL..."
    echo ""

    # Check if PostgreSQL is installed
    if command -v psql &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is installed: $(psql --version | head -n1)${NC}"
    else
        echo "📦 Installing PostgreSQL..."
        brew install postgresql@14
        echo -e "${GREEN}✅ PostgreSQL installed${NC}"
    fi

    # Start PostgreSQL
    if pg_isready -q 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
    else
        echo "🚀 Starting PostgreSQL..."
        brew services start postgresql@14
        sleep 3

        if pg_isready -q 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL started${NC}"
        else
            echo -e "${YELLOW}⚠️  PostgreSQL might still be starting. Please wait...${NC}"
            sleep 2
        fi
    fi

    # Create database
    if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw brokerforce_dev 2>/dev/null; then
        echo -e "${GREEN}✅ Database 'brokerforce_dev' already exists${NC}"
    else
        echo "📝 Creating database 'brokerforce_dev'..."
        if createdb brokerforce_dev 2>/dev/null; then
            echo -e "${GREEN}✅ Database created${NC}"
        else
            echo -e "${YELLOW}⚠️  Could not create database automatically.${NC}"
            echo "   Please create manually: createdb brokerforce_dev"
        fi
    fi

    # Update DATABASE_URL in .env file
    if [ -f google-login-demo/.env ]; then
        if grep -q "^DATABASE_URL=" google-login-demo/.env; then
            # Update existing DATABASE_URL
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL=postgresql://localhost:5432/brokerforce_dev|' google-login-demo/.env
            else
                sed -i 's|^DATABASE_URL=.*|DATABASE_URL=postgresql://localhost:5432/brokerforce_dev|' google-login-demo/.env
            fi
        else
            # Add DATABASE_URL if not present
            echo "" >> google-login-demo/.env
            echo "# Database Configuration" >> google-login-demo/.env
            echo "DATABASE_URL=postgresql://localhost:5432/brokerforce_dev" >> google-login-demo/.env
        fi
        echo -e "${GREEN}✅ DATABASE_URL configured in .env${NC}"
    fi

    # Initialize database schema
    echo "📋 Initializing database schema..."
    cd google-login-demo
    if node db/init.js 2>/dev/null; then
        echo -e "${GREEN}✅ Database schema initialized${NC}"
    else
        echo -e "${YELLOW}⚠️  Schema initialization had issues, but continuing...${NC}"
        echo "   You may need to run manually: cd google-login-demo && node db/init.js"
    fi
    cd ..
    echo ""
else
    echo -e "${YELLOW}⚠️  PostgreSQL setup skipped (Homebrew not available)${NC}"
    echo "   Please install PostgreSQL manually and update DATABASE_URL in google-login-demo/.env"
    echo ""
fi

# Final summary
echo "=============================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Update google-login-demo/.env with:"
echo "   - GOOGLE_CLIENT_ID (from Google Cloud Console)"
echo "   - GOOGLE_CLIENT_SECRET (from Google Cloud Console)"
echo "   - JWT_SECRET (use your generated secret)"
echo ""
echo "2. Start development servers:"
echo "   ./start-servers.sh"
echo ""
echo "3. The app will be available at:"
echo "   📱 Frontend: http://localhost:5173"
echo "   🔐 Backend:  http://localhost:3001"
echo ""
echo "📖 For production deployment, see: PRE_DEPLOYMENT_CHECKLIST.md"
echo ""
