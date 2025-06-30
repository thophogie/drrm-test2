import React, { useState } from 'react';
import { Database, Settings, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const DatabaseSelector: React.FC = () => {
  const { databaseType, switchDatabase, isConnected, connectionError } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedType, setSelectedType] = useState<'supabase' | 'mysql'>('supabase');
  const [mysqlConfig, setMysqlConfig] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    port: 3306
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      if (selectedType === 'mysql') {
        await switchDatabase({
          type: 'mysql',
          mysql: mysqlConfig
        });
      } else {
        await switchDatabase({ type: 'supabase' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

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
              <h2 className="text-xl font-semibold text-gray-900">Database Configuration</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Database Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="supabase"
                      checked={selectedType === 'supabase'}
                      onChange={(e) => setSelectedType(e.target.value as 'supabase')}
                      className="mr-2"
                    />
                    <span>Supabase (PostgreSQL)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="mysql"
                      checked={selectedType === 'mysql'}
                      onChange={(e) => setSelectedType(e.target.value as 'mysql')}
                      className="mr-2"
                    />
                    <span>MySQL</span>
                  </label>
                </div>
              </div>

              {/* MySQL Configuration */}
              {selectedType === 'mysql' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Host
                    </label>
                    <input
                      type="text"
                      value={mysqlConfig.host}
                      onChange={(e) => setMysqlConfig({ ...mysqlConfig, host: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="localhost"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={mysqlConfig.user}
                        onChange={(e) => setMysqlConfig({ ...mysqlConfig, user: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="root"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port
                      </label>
                      <input
                        type="number"
                        value={mysqlConfig.port}
                        onChange={(e) => setMysqlConfig({ ...mysqlConfig, port: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="3306"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={mysqlConfig.password}
                      onChange={(e) => setMysqlConfig({ ...mysqlConfig, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={mysqlConfig.database}
                      onChange={(e) => setMysqlConfig({ ...mysqlConfig, database: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="mdrrmo_db"
                    />
                  </div>
                </div>
              )}

              {/* Supabase Info */}
              {selectedType === 'supabase' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Using existing Supabase configuration from environment variables.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isConnecting && <Loader size={16} className="animate-spin" />}
                <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseSelector;