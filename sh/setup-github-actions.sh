#!/bin/bash

# GitHub Actions Service Account Setup Script
# This script creates and configures a service account for GitHub Actions deployment

# Configuration
PROJECT_ID="sync-458ca"
SA_NAME="github-actions-sa"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
KEY_FILE="github-actions-key.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Setting up GitHub Actions Service Account${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting Google Cloud project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create service account
echo -e "${YELLOW}👤 Creating service account: $SA_NAME${NC}"
gcloud iam service-accounts create $SA_NAME \
    --display-name="GitHub Actions Service Account" \
    --description="Service account for GitHub Actions deployment"

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Service account might already exist, continuing...${NC}"
fi

# Grant required permissions
echo -e "${YELLOW}🔐 Granting required permissions...${NC}"

# Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin"

# Storage Admin (for Container Registry)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin"

# Artifact Registry Writer (for new GCR backend)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.writer"

# Service Account User
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/iam.serviceAccountUser"

# Create and download service account key
echo -e "${YELLOW}🔑 Creating service account key...${NC}"
gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SA_EMAIL

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Service account setup completed!${NC}"
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Copy the contents of $KEY_FILE"
    echo "2. Go to your GitHub repository settings"
    echo "3. Navigate to Settings → Secrets and variables → Actions"
    echo "4. Create a new secret named 'GCP_SA_KEY'"
    echo "5. Paste the entire contents of $KEY_FILE as the secret value"
    echo ""
    echo -e "${YELLOW}📄 Service account key file created: $KEY_FILE${NC}"
    echo -e "${RED}⚠️  IMPORTANT: Keep this key file secure and never commit it to version control!${NC}"
    echo ""
    echo -e "${YELLOW}🗑️  You can delete the key file after adding it to GitHub secrets:${NC}"
    echo "rm $KEY_FILE"
else
    echo -e "${RED}❌ Failed to create service account key${NC}"
    exit 1
fi

# Display service account information
echo -e "${YELLOW}📊 Service account information:${NC}"
echo "Service Account: $SA_EMAIL"
echo "Project ID: $PROJECT_ID"
echo "Roles granted:"
echo "  - roles/run.admin"
echo "  - roles/storage.admin"
echo "  - roles/artifactregistry.writer"
echo "  - roles/iam.serviceAccountUser"
