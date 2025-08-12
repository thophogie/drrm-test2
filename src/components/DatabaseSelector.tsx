import React, { useState } from 'react';
import { Database, Settings, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const DatabaseSelector: React.FC = () => {
  const { databaseType, isConnected, connectionError } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Database Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <Database size={16} />
        <span className="font-medium">
          {databaseType === 'supabase' ? 'Supabase' : 'MySQL'}
        </span>
        {isConnected ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <XCircle size={16} className="text-red-500" />
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="text-xs text-red-600 mt-1">
          {connectionError}
        </div>
      )}

      {/* Database Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Database Status</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Currently using Supabase (PostgreSQL) database. This is the recommended option for production use.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> MySQL support is not available in the browser environment. 
                  Supabase provides all necessary features including real-time updates, authentication, and file storage.
                </p>
              </div>

              {connectionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Connection Error:</strong> {connectionError}
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Please check your Supabase configuration in the .env file.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseSelector;