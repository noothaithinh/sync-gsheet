#!/bin/bash

# Google Cloud Run Deployment Script for Sync GSheet

# Configuration - Update these variables
PROJECT_ID="sync-458ca"
SERVICE_NAME="sync-gsheet"
REGION="asia-southeast1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to Google Cloud Run${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Authenticate with Google Cloud (if needed)
echo -e "${YELLOW}🔐 Checking Google Cloud authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}Please authenticate with Google Cloud:${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${YELLOW}📋 Setting Google Cloud project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker to use gcloud as a credential helper
echo -e "${YELLOW}🐳 Configuring Docker authentication...${NC}"
gcloud auth configure-docker gcr.io

# Check if .env file exists and load environment variables
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found. Please create one with your environment variables.${NC}"
    echo "The following environment variables are required:"
    echo "- NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "- NEXT_PUBLIC_FIREBASE_DATABASE_URL"
    echo "- NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "- NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "- NEXT_PUBLIC_GOOGLE_CLIENT_ID"
    exit 1
fi

echo -e "${YELLOW}📝 Loading environment variables from .env file...${NC}"
source .env

# Build the Docker image with build arguments
echo -e "${YELLOW}🏗️  Building Docker image with environment variables...${NC}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="$IMAGE_NAME:$TIMESTAMP"

docker build \
    --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
    --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
    --build-arg NEXT_PUBLIC_FIREBASE_DATABASE_URL="$NEXT_PUBLIC_FIREBASE_DATABASE_URL" \
    --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
    --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
    --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
    --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID="$NEXT_PUBLIC_GOOGLE_CLIENT_ID" \
    -t $IMAGE_TAG .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Push the image to Google Container Registry
echo -e "${YELLOW}📤 Pushing image to Google Container Registry...${NC}"
docker push $IMAGE_TAG

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker push failed${NC}"
    exit 1
fi

# Deploy to Cloud Run
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_TAG \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars "NODE_ENV=production,NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_DATABASE_URL=$NEXT_PUBLIC_FIREBASE_DATABASE_URL,NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID,NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    echo -e "${GREEN}🌐 Your app is live at: $SERVICE_URL${NC}"
    
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Update your Google OAuth credentials with the new domain:"
    echo "   - Go to Google Cloud Console > APIs & Services > Credentials"
    echo "   - Edit your OAuth 2.0 Client ID"
    echo "   - Add $SERVICE_URL to authorized JavaScript origins"
    echo "   - Add $SERVICE_URL to authorized redirect URIs"
    echo ""
    echo "2. ✅ Environment variables have been automatically set from your .env file"
    echo ""
    echo "3. Test your deployment by visiting: $SERVICE_URL"
    
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
