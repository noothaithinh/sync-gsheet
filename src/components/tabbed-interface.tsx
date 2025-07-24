'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard/dashboard';
import FirebaseDemo from '@/components/firebase-demo';
import Navbar from '@/components/navbar';

export default function TabbedInterface() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'demo'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'demo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Firebase Demo
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'demo' && <FirebaseDemo />}
      </div>
    </div>
  );
}
