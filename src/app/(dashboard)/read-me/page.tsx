export default function ReadmePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🚀 Sync GSheet - Firebase Realtime Database Demo
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            A Next.js application that demonstrates Firebase Realtime Database
            integration with the ability to create and sync data in real-time.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                🚀 Features
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li>
                  • <strong>Next.js 15</strong> with App Router
                </li>
                <li>
                  • <strong>TypeScript</strong> for type safety
                </li>
                <li>
                  • <strong>Tailwind CSS</strong> for styling
                </li>
                <li>
                  • <strong>Firebase Realtime Database</strong> integration
                </li>
                <li>
                  • <strong>ESLint + Prettier</strong> for code quality
                </li>
                <li>
                  • <strong>pnpm</strong> for package management
                </li>
                <li>• Real-time data synchronization</li>
                <li>• Responsive design</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">
                🛠️ Tech Stack
              </h2>
              <ul className="space-y-2 text-green-800">
                <li>
                  • <strong>Framework</strong>: Next.js 15
                </li>
                <li>
                  • <strong>Language</strong>: TypeScript
                </li>
                <li>
                  • <strong>Styling</strong>: Tailwind CSS
                </li>
                <li>
                  • <strong>Database</strong>: Firebase Realtime Database
                </li>
                <li>
                  • <strong>Package Manager</strong>: pnpm
                </li>
                <li>
                  • <strong>Linting</strong>: ESLint with Prettier
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Prerequisites
            </h2>
            <p className="text-gray-700 mb-3">
              Before you begin, ensure you have:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Node.js (18+ recommended)</li>
              <li>pnpm installed</li>
              <li>A Firebase project with Realtime Database enabled</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-yellow-900 mb-4">
              🚀 Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  1. Clone the repository
                </h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  git clone &lt;your-repo-url&gt;
                  <br />
                  cd sync-gsheet
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  2. Install dependencies
                </h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  pnpm install
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  3. Configure environment variables
                </h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  cp .env.example .env.local
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  4. Run the development server
                </h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  pnpm dev
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-purple-900 mb-4">
              🔧 Available Scripts
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm dev</code> -
                Start development server
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm build</code> -
                Build for production
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm start</code> -
                Start production server
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm lint</code> -
                Run ESLint
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm lint:fix</code>{' '}
                - Fix ESLint issues
              </div>
              <div className="bg-white p-3 rounded border border-purple-200">
                <code className="text-purple-700 font-mono">pnpm format</code> -
                Format code with Prettier
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
              🌟 Features Demo
            </h2>
            <p className="text-indigo-800 mb-4">
              The application includes a demo that showcases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-indigo-800 mb-6">
              <li>Adding data to Firebase Realtime Database</li>
              <li>
                Real-time data synchronization across multiple browser tabs
              </li>
              <li>TypeScript integration with Firebase</li>
              <li>Responsive design with Tailwind CSS</li>
            </ul>

            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                🔗 API Webhook Integration
              </h3>
              <p className="text-indigo-800 mb-3">
                The application includes a sync webhook endpoint to sync data
                from Google Sheets:
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-3">
                GET http://localhost:3000/hooks/sync
              </div>
              <p className="text-sm text-indigo-700">
                Don&apos;t forget to set up your Google Sheets API credentials
                and replace the placeholder [TODO] in the code.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
            <h2 className="text-2xl font-semibold mb-4">🚀 Ready to Deploy?</h2>
            <p className="mb-4">
              The easiest way to deploy is using <strong>Vercel</strong>. Push
              your code to a Git repository, import to Vercel, add your
              environment variables, and deploy!
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                📚 Next.js Docs
              </a>
              <a
                href="https://firebase.google.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                🔥 Firebase Docs
              </a>
              <a
                href="https://tailwindcss.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                🎨 Tailwind Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
