# Google Cloud Run Deployment Guide

This guide will help you deploy the Sync GSheet application to Google Cloud Run using Docker.

## Prerequisites

1. **Google Cloud Account**: Create an account at [Google Cloud Console](https://console.cloud.google.com/)
2. **Google Cloud CLI**: Install from [here](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install from [here](https://docs.docker.com/get-docker/)
4. **Project Setup**: Create a new Google Cloud project or use an existing one

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

2. **Configure deployment settings**
   
   # Edit sh/deploy-cloud-run.sh and update these variables:

2. **Run the deployment**:
   ```bash
   ./sh/deploy-cloud-run.sh
   ```

### Option 2: Manual Deployment

1. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs**:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

3. **Build and push the Docker image**:
   ```bash
   # Build the image
   docker build -t gcr.io/YOUR_PROJECT_ID/sync-gsheet .
   
   # Push to Google Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/sync-gsheet
   ```

4. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy sync-gsheet \
     --image gcr.io/YOUR_PROJECT_ID/sync-gsheet \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --port 3000 \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10
   ```

## Environment Variables Configuration

After deployment, set your environment variables in the Cloud Run service:

1. **Go to Cloud Run Console**: https://console.cloud.google.com/run
2. **Select your service** and click **Edit & Deploy New Revision**
3. **Go to Variables & Secrets tab**
4. **Add the following environment variables**:

### Required Environment Variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com

# Production Environment
NODE_ENV=production
```

## Post-Deployment Configuration

### 1. Update Google OAuth Settings

1. Go to [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add your Cloud Run URL to:
   - **Authorized JavaScript origins**: `https://your-service-url.run.app`
   - **Authorized redirect URIs**: `https://your-service-url.run.app`

### 2. Update Firebase Security Rules

Update your Firebase Realtime Database rules for production:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 3. Custom Domain (Optional)

To use a custom domain:

1. **Map your domain** in Cloud Run console
2. **Update DNS records** as instructed
3. **Update OAuth settings** with your custom domain

## Monitoring and Logs

- **View logs**: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=sync-gsheet"`
- **Monitor performance**: Visit the Cloud Run console to see metrics
- **Error tracking**: Enable Cloud Error Reporting for better debugging

## Cost Optimization

Cloud Run pricing is based on:
- **CPU and memory usage** (pay-per-use)
- **Network egress**
- **Container registry storage**

To optimize costs:
- Use the minimum required memory/CPU
- Set appropriate concurrency limits
- Enable CPU throttling when not serving requests

## Troubleshooting

### Common Issues:

1. **Build fails**: Check Dockerfile syntax and dependencies
2. **Authentication errors**: Verify OAuth credentials and authorized domains
3. **Firebase connection issues**: Check environment variables and Firebase rules
4. **Cold starts**: Use minimum instances if needed for consistent performance

### Useful Commands:

```bash
# View service details
gcloud run services describe sync-gsheet --region=asia-southeast1

# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Update environment variables
gcloud run services update sync-gsheet \
  --set-env-vars="KEY=VALUE" \
  --region=asia-southeast1

# Delete service (if needed)
gcloud run services delete sync-gsheet --region=asia-southeast1
```

## Security Best Practices

1. **Use least privilege** for service accounts
2. **Enable VPC connector** if accessing private resources
3. **Set up Cloud Armor** for DDoS protection
4. **Use Secret Manager** for sensitive environment variables
5. **Enable audit logging** for compliance

For more information, visit the [Cloud Run documentation](https://cloud.google.com/run/docs).
