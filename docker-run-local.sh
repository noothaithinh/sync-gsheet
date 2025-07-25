#!/bin/bash

# Local Docker Run Script for Sync GSheet
# This script builds and runs the Docker container with proper environment variables

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Building and running Sync GSheet locally with Docker${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Please create one with your environment variables.${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"

# Source the .env file to load variables
source .env

docker build \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
    --build-arg NEXT_PUBLIC_FIREBASE_DATABASE_URL="$NEXT_PUBLIC_FIREBASE_DATABASE_URL" \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
    --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID="$NEXT_PUBLIC_GOOGLE_CLIENT_ID" \
    -t sync-gsheet:local .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Run the container with environment variables
echo -e "${YELLOW}🚀 Starting container with environment variables...${NC}"
docker run -p 3000:3000 \
    --name sync-gsheet-local \
    --rm \
    sync-gsheet:local

echo -e "${GREEN}✅ Container stopped${NC}"
