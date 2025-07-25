# [Google OAuth Setup Instructions](https://developers.google.com/identity/sign-in/web/sign-in)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to **APIs & Services > OAuth consent screen**
2. Choose **External** user type (for testing) or **Internal** (for organization use)
3. Fill in the required information:
   - App name: `Sync GSheet`
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes if needed (basic profile info is included by default)
5. Add test users if using External type

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Choose **Web application**
4. Name it `Sync GSheet Web Client`
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain (when deploying)
7. Click **Create**

## Step 4: Configure Environment Variables

1. Copy the **Client ID** from the credentials you just created
2. Create a `.env.local` file in your project root (if it doesn't exist)
3. Add the following line:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

## Step 5: Test the Integration

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000/login`
3. The Google Sign-In button should appear
4. Click it to test the authentication flow

## Troubleshooting

### Common Issues:

1. **"Invalid client" error**: Check that your domain is added to authorized origins
2. **Button not showing**: Verify your Client ID is correct in `.env.local`
3. **One Tap not working**: Make sure you're using HTTPS in production

### Security Notes:

- Never commit your `.env.local` file to version control
- Use different Client IDs for development and production
- Regularly rotate your credentials
- Review and limit the scopes your application requests

## Production Deployment

When deploying to production:

1. Create new OAuth credentials for your production domain
2. Update authorized origins and redirect URIs
3. Set the production Client ID in your hosting platform's environment variables
4. Ensure your domain is verified in Google Cloud Console
