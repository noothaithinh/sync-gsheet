'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';

interface TableData {
  id: string;
  field1: string;
  field2: string;
  createdAt: string;
}

export default function Dashboard() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataRef = ref(database, 'table_name_1');

    try {
      onValue(
        dataRef,
        (snapshot) => {
          setLoading(false);
          const data = snapshot.val();
          if (data) {
            const dataArray = Object.entries(data).map(([id, value]) => ({
              id,
              ...(value as Omit<TableData, 'id'>),
            }));
            // Sort by creation date, newest first
            setData(
              dataArray.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            );
          } else {
            setData([]);
          }
          setError(null);
        },
        (error) => {
          setLoading(false);
          setError(error.message);
          console.error('Firebase error:', error);
        }
      );
    } catch (err) {
      setLoading(false);
      setError('Failed to connect to Firebase');
      console.error('Connection error:', err);
    }

    return () => off(dataRef);
  }, []);

  const triggerSync = async () => {
    try {
      const response = await fetch('/hooks/sync', {
        method: 'GET',
      });

      if (response.ok) {
        console.log('Sync triggered successfully');
      } else {
        console.error('Sync failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Connection Error
          </h3>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Please check your Firebase configuration in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          GSheet Sync Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time data from table_name_1 • {data.length} records
        </p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={triggerSync}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Trigger Sync
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Records
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Latest Sync
          </h3>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {data.length > 0
              ? new Date(data[0].createdAt).toLocaleString()
              : 'No data'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Status
          </h3>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-lg font-semibold text-green-600">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Data</h2>
        </div>

        {data.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No data available
            </h3>
            <p className="text-gray-400 mb-4">
              Click &ldquo;Trigger Sync&rdquo; to fetch data from your API
              endpoint
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {item.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.field1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.field2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                      {index === 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Latest
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real-time indicator */}
      <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span>Real-time updates enabled</span>
        </div>
      </div>
    </div>
  );
}
