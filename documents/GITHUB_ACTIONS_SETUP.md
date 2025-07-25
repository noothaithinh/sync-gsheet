# GitHub Actions Setup for Google Cloud Run Deployment

This guide will help you set up automatic deployment to Google Cloud Run using GitHub Actions with separate environments for nightly and production deployments.

## 🚀 Overview

We've created two GitHub Actions workflows with multi-environment support:

1. **`ci.yml`** - Runs on pull requests (testing and validation)
2. **`deploy.yml`** - Runs on merged PRs with environment-specific deployment:
   - **Merge to `main`** → Deploy to **Nightly** environment
   - **Merge to `master`** → Deploy to **Production** environment

## 🌍 Environment Configuration

### Branch-to-Environment Mapping:
- **`main` branch** → **`nightly`** environment → `sync-gsheet-nightly` service
- **`master` branch** → **`production`** environment → `sync-gsheet-prod` service

### Manual Deployment:
- Can manually trigger deployment to either environment via GitHub Actions interface

## 📋 Prerequisites

1. **Google Cloud Project** with Cloud Run enabled
2. **GitHub Repository** with your code
3. **Service Account** with appropriate permissions
4. **Two separate Firebase projects** (recommended) for nightly and production

## 🔧 Setup Instructions

### Step 1: Create Google Cloud Service Account

1. **Go to Google Cloud Console**:
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

2. **Create Service Account**:
   ```bash
   gcloud iam service-accounts create github-actions-sa \
     --display-name="GitHub Actions Service Account" \
     --description="Service account for GitHub Actions deployment"
   ```

3. **Grant Required Permissions**:
   ```bash
   # Set your project ID
   PROJECT_ID="sync-458ca"
   
   # Grant Cloud Run Admin role
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   # Grant Storage Admin role (for Container Registry)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # Grant Service Account User role
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

4. **Create and Download Service Account Key**:
   ```bash
   gcloud iam service-accounts keys create github-actions-key.json \
     --iam-account=github-actions-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

### Step 2: Create GitHub Environments

1. **Go to your repository settings** → **Environments**

2. **Create Nightly Environment**:
   - Click **New environment**
   - Name: `nightly`
   - Configure deployment rules (optional):
     - Add required reviewers if needed
     - Set deployment branches to `main` only

3. **Create Production Environment**:
   - Click **New environment**
   - Name: `production`
   - Configure deployment rules (recommended):
     - Add required reviewers for production deployments
     - Set deployment branches to `master` only
     - Add deployment protection rules

### Step 3: Configure Environment Secrets

For each environment (`nightly` and `production`), add the following secrets:

#### Required Secrets for BOTH Environments:

1. **`PROJECT_ID`**:
   - Your Google Cloud Project ID
   - For nightly: could be a development project ID
   - For production: your production project ID

2. **`GCP_SA_KEY`**:
   - Copy the entire contents of `github-actions-key.json`
   - Paste as an environment secret

3. **Firebase Configuration Secrets**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_DATABASE_URL
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   ```

4. **Google OAuth Secret**:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID
   ```

#### How to Add Environment Secrets:

1. Go to **Settings** → **Environments**
2. Click on the environment name (`nightly` or `production`)
3. Scroll down to **Environment secrets**
4. Click **Add secret**
5. Add each secret with its corresponding value

#### Environment-Specific Values:

**Nightly Environment**:
- **PROJECT_ID**: Development/staging Google Cloud project (e.g., `sync-458ca-dev`)
- Use your development/staging Firebase project credentials
- Use development Google OAuth client ID
- Consider using a separate domain for nightly deployments

**Production Environment**:
- **PROJECT_ID**: Production Google Cloud project (e.g., `sync-458ca`)
- Use your production Firebase project credentials
- Use production Google OAuth client ID
- Use your production domain configuration

**Example Configuration**:
```
Nightly Environment Secrets:
PROJECT_ID=sync-458ca-dev
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sync-dev-project
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123-dev.apps.googleusercontent.com

Production Environment Secrets:
PROJECT_ID=sync-458ca
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sync-458ca
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123-prod.apps.googleusercontent.com
```

### Step 4: Update Workflow Configuration

The workflow is already configured for your project, but verify these values in `.github/workflows/deploy.yml`:

```yaml
env:
  PROJECT_ID: sync-458ca  # Update if different
```

### Step 5: Enable APIs

Make sure these APIs are enabled in your Google Cloud project:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## 🔄 Deployment Workflow

### Development Flow:

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create PR to main
   ```

2. **Nightly Deployment**:
   ```bash
   # PR reviewed and merged to main
   # → Automatically deploys to nightly environment
   # → Service: sync-gsheet-nightly
   ```

3. **Production Release**:
   ```bash
   git checkout master
   git merge main
   git push origin master
   # → Create PR from main to master
   # → After merge, deploys to production environment
   # → Service: sync-gsheet-prod
   ```

### Manual Deployment:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Google Cloud Run** workflow
3. Click **Run workflow**
4. Choose environment (`nightly` or `production`)
5. Choose branch and click **Run workflow**

## 🛡️ Security and Environment Protection

### Recommended Protection Rules:

**Nightly Environment**:
- ✅ Allow deployments from `main` branch
- ⚠️ Optional: Require reviewers for sensitive changes

**Production Environment**:
- ✅ Allow deployments from `master` branch only
- ✅ Require 1-2 reviewers for all deployments
- ✅ Wait timer (e.g., 5 minutes) before deployment
- ✅ Prevent deployments during maintenance windows

### Setting Up Protection Rules:

1. Go to **Settings** → **Environments** → Select environment
2. Configure **Deployment protection rules**:
   - **Required reviewers**: Add team members who can approve production deployments
   - **Wait timer**: Add delay before deployment starts
   - **Deployment branches**: Restrict which branches can deploy

## 📊 Service URLs

After deployment, you'll have two separate services:

- **Nightly**: `https://sync-gsheet-nightly-[hash].a.run.app`
- **Production**: `https://sync-gsheet-prod-[hash].a.run.app`

Each environment can have its own:
- Firebase project
- Google OAuth credentials
- Custom domains
- Environment variables

## 🔍 Monitoring and Debugging

### View Deployment History:
- Go to **Actions** tab → **Deploy to Google Cloud Run**
- Each run shows which environment was deployed

### Environment-Specific Logs:
```bash
# Nightly logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sync-gsheet-nightly" --limit=50

# Production logs  
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sync-gsheet-prod" --limit=50
```

### Common Issues:

1. **Environment secrets not found**: Verify secrets are added to the correct environment
2. **Deployment to wrong environment**: Check the target branch of your PR
3. **Permission errors**: Ensure service account has access to both services

## 🚀 Best Practices

1. **Use separate Firebase projects** for nightly and production
2. **Set up branch protection** on `master` to require PR reviews
3. **Test changes in nightly** before promoting to production
4. **Use semantic versioning** for releases
5. **Monitor both environments** for performance and errors
6. **Set up alerts** for production deployments

## 📝 OAuth Configuration

Don't forget to update your Google OAuth settings for each environment:

**Nightly Environment**:
- Add nightly service URL to authorized origins
- Use development OAuth client ID

**Production Environment**:
- Add production service URL to authorized origins  
- Use production OAuth client ID

This multi-environment setup ensures safe, controlled deployments with proper separation between development and production environments! 🎉
