/**
 * Cache Management API Services
 * Distributed caching and cache optimization
 */
import { api } from './client';

export interface CacheCluster {
  id: string;
  name: string;
  nodes: Array<{
    id: string;
    host: string;
    status: 'healthy' | 'unhealthy';
    memory: {
      used: number;
      total: number;
    };
  }>;
  hitRatio: number;
  evictions: number;
}

export const cacheManagementAPI = {
  getClusters: async (): Promise<CacheCluster[]> => {
    const { data } = await api.get('/cache/clusters');
    return data;
  },
  
  flushCache: async (clusterId: string): Promise<void> => {
    await api.post(`/cache/clusters/${clusterId}/flush`);
  },
};

export default cacheManagementAPI;