import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type DatabaseType = 'supabase' | 'mysql';

interface DatabaseConfig {
  type: DatabaseType;
  mysql?: {
    host: string;
    user: string;
    password: string;
    database: string;
    port?: number;
  };
}

interface DatabaseContextType {
  databaseType: DatabaseType;
  switchDatabase: (config: DatabaseConfig) => Promise<void>;
  isConnected: boolean;
  connectionError: string | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [databaseType, setDatabaseType] = useState<DatabaseType>('supabase');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Test initial Supabase connection
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('news').select('count').limit(1);
      if (error) throw error;
      setIsConnected(true);
      setConnectionError(null);
    } catch (error) {
      setIsConnected(false);
      setConnectionError('Failed to connect to Supabase. Please check your configuration.');
      console.error('Supabase connection error:', error);
    }
  };

  const switchDatabase = async (config: DatabaseConfig) => {
    setIsConnected(false);
    setConnectionError(null);

    if (config.type === 'mysql') {
      // MySQL is not supported in browser environment
      setConnectionError('MySQL is not supported in browser environment. Please use Supabase.');
      return;
    } else {
      await testSupabaseConnection();
      if (isConnected) {
        setDatabaseType('supabase');
      }
    }
  };

  return (
    <DatabaseContext.Provider value={{
      databaseType,
      switchDatabase,
      isConnected,
      connectionError
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};