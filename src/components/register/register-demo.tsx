'use client';

import { useState, useEffect } from 'react';
import { ref, push, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';

interface DataItem {
  id: string;
  name: string;
  email: string;
  timestamp: number;
}

export default function RegisterDemo() {
  const [data, setData] = useState<DataItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dataRef = ref(database, 'users');

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<DataItem, 'id'>),
        }));
        setData(dataArray.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setData([]);
      }
    });

    return () => off(dataRef);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const dataRef = ref(database, 'users');
      await push(dataRef, {
        name: name.trim(),
        email: email.trim(),
        timestamp: Date.now(),
      });

      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding data:', error);
      alert('Error adding data. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Register Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Data Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter name"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </form>
        </div>

        {/* Data Display */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Realtime Data ({data.length} items)
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No data yet. Add some data to see real-time updates!
              </p>
            ) : (
              data.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.email}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">
          Setup Instructions:
        </h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>
            Create a Firebase project at{' '}
            <a
              href="https://console.firebase.google.com"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              console.firebase.google.com
            </a>
          </li>
          <li>Enable Realtime Database in your Firebase project</li>
          <li>Copy your Firebase configuration</li>
          <li>
            Create a{' '}
            <code className="bg-yellow-200 px-1 rounded">.env.local</code> file
            and add your Firebase config
          </li>
          <li>
            Update database rules for development (make sure to secure for
            production)
          </li>
        </ol>
      </div>
    </div>
  );
}
