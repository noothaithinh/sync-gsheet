# Sync GSheet - Next.js Firebase Application

A production-ready Next.js application with Firebase integration, Google OAuth authentication, and automated deployment to Google Cloud Run.

## 🚀 Features

- **Next.js 15** with App Router and TypeScript
- **Firebase Realtime Database** with real-time synchronization
- **Google OAuth Authentication** with JWT token parsing
- **Responsive Design** with Tailwind CSS
- **Route Protection** with AuthGuard component
- **Multi-Environment Deployment** (Nightly/Production)
- **Docker Containerization** for Cloud Run
- **Automated CI/CD** with GitHub Actions
- **Google Sheets Integration** via webhook API
- **ESLint + Prettier** for code quality
- **pnpm** for efficient package management

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with responsive design
- **Database**: Firebase Realtime Database
- **Authentication**: Google OAuth 2.0
- **Deployment**: Google Cloud Run with Docker
- **CI/CD**: GitHub Actions with environment-specific secrets
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, TypeScript

## 🏗️ Architecture

### Application Structure

```
src/
├── app/
│   ├── (dashboard)/              # Protected dashboard group
│   │   ├── layout.tsx           # Auth guard + navigation
│   │   ├── page.tsx             # Main dashboard
│   │   └── read-me/
│   │       └── page.tsx         # Documentation viewer
│   ├── hooks/
│   │   └── sync/
│   │       └── route.ts         # Google Sheets webhook API
│   ├── login/                   # Authentication pages
│   ├── register/
│   ├── layout.tsx               # Root layout
├── components/
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard-specific components
│   └── shared/                  # Reusable UI components
└── lib/
    └── firebase.ts              # Firebase configuration
```

### Deployment Architecture

- **Development**: Local development with hot reloading
- **Nightly**: Automated deployment from `main` branch
- **Production**: Automated deployment from `master` branch
- **Infrastructure**: Google Cloud Run with auto-scaling
- **Security**: Environment-specific secrets and service accounts

## 📋 Prerequisites

- **Node.js** 18+ with pnpm
- **Firebase Project** with Realtime Database
- **Google Cloud Project** for deployment
- **GitHub Repository** with Actions enabled

## 🚀 Quick Start

### 1. Local Development Setup

```bash
# Clone and install
git clone git@github.com:noothaithinh/sync-gsheet.git
cd sync-gsheet
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase and Google OAuth credentials

# Start development server
pnpm dev
# Open http://localhost:3000
```

### 2. Firebase Configuration

Create a Firebase project and add these environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://project-rtdb.firebaseio.com/
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_GOOGLE_CLIENT_ID=google_oauth_client_id
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)

## 🔧 Available Scripts

### Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm format           # Format with Prettier
pnpm type-check       # TypeScript type checking
```

### Deployment

```bash
# Docker commands
docker build -t sync-gsheet .
docker run -p 3000:3000 sync-gsheet

# Google Cloud Run deployment
./sh/setup-github-actions.sh  # Initial setup
# Then use GitHub Actions for automated deployment
```

## 🌐 Deployment

### Multi-Environment Setup

The application supports automated deployment to multiple environments:

#### **Nightly Environment**

- **Trigger**: Merge to `main` branch
- **Resources**: 1 CPU, 1Gi memory, 5 max instances
- **URL**: `https://sync-gsheet-nightly-*.run.app`

#### **Production Environment**

- **Trigger**: Merge to `master` branch
- **Resources**: 2 CPU, 2Gi memory, 20 max instances
- **URL**: `https://sync-gsheet-prod-*.run.app`

### GitHub Actions Setup

1. **Run setup script**:

   ```bash
   chmod +x sh/setup-github-actions.sh
   ./sh/setup-github-actions.sh
   ```

2. **Configure GitHub Secrets**:
   - Add service account key as `GCP_SA_KEY`
   - Set project ID as `PROJECT_ID` (environment-specific)
   - Add all Firebase config secrets

3. **Configure GitHub Variables** (optional):

   ```bash
   # Production resources
   gh variable set PROD_MEMORY --body "4Gi"
   gh variable set PROD_CPU --body "4"
   gh variable set PROD_MAX_INSTANCES --body "50"

   # Nightly resources
   gh variable set NIGHTLY_MEMORY --body "512Mi"
   gh variable set NIGHTLY_CPU --body "0.5"
   gh variable set NIGHTLY_MAX_INSTANCES --body "3"
   ```

### Manual Deployment

```bash
# Build and deploy manually
gcloud run deploy sync-gsheet \
  --image gcr.io/PROJECT_ID/sync-gsheet:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 20
```

## 🔗 API Endpoints

### Webhook Integration

```http
GET /hooks/sync
```

Synchronizes data from Google Sheets to Firebase.

**Response**: JSON with sync status and statistics

### Authentication Flow

The app uses Google OAuth with automatic token refresh and JWT parsing for user information.

## � Security Features

- **Route Protection**: AuthGuard component protects dashboard routes
- **Environment Isolation**: Separate secrets for nightly/production
- **Service Account Security**: Minimal IAM permissions
- **Firebase Rules**: Configurable database security rules
- **OAuth Validation**: Server-side token verification

### Recommended Firebase Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 📊 Monitoring & Observability

- **Cloud Run Metrics**: Automatic scaling and performance monitoring
- **GitHub Actions Logs**: Deployment history and status
- **Firebase Console**: Database usage and security insights
- **Error Boundaries**: React error handling for better UX

## 🛠️ Development Guidelines

### Code Quality

- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for consistent formatting
- Pre-commit hooks for code quality

### Component Structure

- **Route Groups**: Organized by functionality
- **Shared Components**: Reusable UI elements
- **Custom Hooks**: Business logic abstraction
- **Type Safety**: Full TypeScript coverage

### Environment Management

- **Local**: `.env.local` for development
- **Nightly**: GitHub environment secrets
- **Production**: GitHub environment secrets
- **Build Time**: Docker build arguments

## � Documentation

- [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md)
- [GitHub Variables Guide](./GITHUB_VARIABLES_SETUP.md)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [Docker Deployment](./Dockerfile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## � Links

- **Live Demo**: [https://sync-gsheet-prod-\*.run.app](https://sync-gsheet-prod-*.run.app)
- **Nightly Build**: [https://sync-gsheet-nightly-\*.run.app](https://sync-gsheet-nightly-*.run.app)
- **GitHub Repository**: [Your Repository URL]
- **Documentation**: Available in the `/read-me` page of the application

---

**Note**: This application demonstrates modern full-stack development practices with enterprise-grade deployment automation. Perfect for learning Next.js, Firebase, and Google Cloud Platform integration.
