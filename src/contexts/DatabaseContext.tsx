import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MySQLDatabase from '../lib/mysql';

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
  switchDatabase: (config: DatabaseConfig) => void;
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
  const [mysqlInstance, setMysqlInstance] = useState<MySQLDatabase | null>(null);

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
      setConnectionError('Failed to connect to Supabase');
      console.error('Supabase connection error:', error);
    }
  };

  const testMySQLConnection = async (config: DatabaseConfig['mysql']) => {
    if (!config) throw new Error('MySQL config is required');
    
    try {
      const mysql = new MySQLDatabase(config);
      await mysql.query('SELECT 1');
      setMysqlInstance(mysql);
      setIsConnected(true);
      setConnectionError(null);
      return true;
    } catch (error) {
      setIsConnected(false);
      setConnectionError('Failed to connect to MySQL');
      console.error('MySQL connection error:', error);
      return false;
    }
  };

  const switchDatabase = async (config: DatabaseConfig) => {
    setIsConnected(false);
    setConnectionError(null);

    if (config.type === 'mysql') {
      const success = await testMySQLConnection(config.mysql);
      if (success) {
        setDatabaseType('mysql');
      }
    } else {
      await testSupabaseConnection();
      if (isConnected) {
        setDatabaseType('supabase');
        if (mysqlInstance) {
          await mysqlInstance.close();
          setMysqlInstance(null);
        }
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