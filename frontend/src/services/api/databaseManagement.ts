/**
 * Database Management API Services
 * Database operations, backup, and performance monitoring
 */
import { api } from './client';

export interface DatabaseInstance {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'mongodb' | 'redis';
  version: string;
  status: 'running' | 'stopped' | 'maintenance';
  connections: {
    active: number;
    max: number;
  };
  storage: {
    used: number;
    total: number;
  };
  performance: {
    queriesPerSecond: number;
    averageQueryTime: number;
    cacheHitRatio: number;
  };
}

export const databaseManagementAPI = {
  getDatabases: async (): Promise<DatabaseInstance[]> => {
    const { data } = await api.get('/databases');
    return data;
  },
  
  backupDatabase: async (databaseId: string): Promise<void> => {
    await api.post(`/databases/${databaseId}/backup`);
  },
  
  optimizeDatabase: async (databaseId: string): Promise<void> => {
    await api.post(`/databases/${databaseId}/optimize`);
  },
};

export default databaseManagementAPI;