# Sync GSheet - Firebase Realtime Database Demo

A Next.js application that demonstrates Firebase Realtime Database integration with the ability to create and sync data in real-time.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Firebase Realtime Database** integration
- **ESLint + Prettier** for code quality
- **pnpm** for package management
- Real-time data synchronization
- Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Realtime Database
- **Package Manager**: pnpm
- **Linting**: ESLint with Prettier

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (18+ recommended)
- pnpm installed
- A Firebase project with Realtime Database enabled

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd sync-gsheet
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Realtime Database
   - Copy your Firebase configuration

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase configuration in `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com/
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Update Firebase Database Rules** (for development)

   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

   ⚠️ **Note**: Update these rules for production security

6. **Run the development server**

   ```bash
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx           # Dashboard layout with auth guard
│   │   ├── page.tsx             # Main dashboard page
│   │   └── read-me/
│   │       └── page.tsx         # README documentation page
│   ├── hooks/
│   │   └── sync/
│   │       └── route.ts         # API endpoint for data sync
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── register/
│   │   └── page.tsx             # Registration page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page (redirects to dashboard)
│   ├── globals.css              # Global styles
│   └── favicon.ico              # Favicon
├── components/
│   ├── auth/
│   │   ├── auth-guard.tsx       # Route protection component
│   │   └── auth-provider.tsx    # Authentication context provider
│   ├── dashboard/
│   │   └── dashboard.tsx        # Dashboard component
│   ├── register/
│   │   └── register-demo.tsx    # Registration demo component
│   ├── firebase-demo.tsx        # Firebase demo component
│   ├── navbar.tsx               # Navigation component
│   └── tabbed-interface.tsx     # Tabbed interface component
└── lib/
    ├── auth.tsx                 # Authentication utilities
    └── firebase.ts              # Firebase configuration
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking

## 🌟 Features Demo

The application includes a demo that showcases:

- Adding data to Firebase Realtime Database
- Real-time data synchronization across multiple browser tabs
- TypeScript integration with Firebase
- Responsive design with Tailwind CSS

### 🔗 API Webhook Integration

The application includes a sync webhook endpoint to sync data from Google Sheets:

```
GET http://localhost:3000/hooks/sync
```

Don't forget to set up your Google Sheets API credentials and replace the placeholder [TODO] in the code.

## 🔒 Security

- Environment variables are used for Firebase configuration
- Database rules should be updated for production use
- Client-side validation and error handling implemented
- All envs in the demo project are public as NEXT_PUBLIC_... plase consider to make them private.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
