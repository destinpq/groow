/**
 * Microservices Management API
 * Service discovery, health monitoring, and inter-service communication
 */
import { api } from './client';

export interface Microservice {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'running' | 'stopped' | 'deploying' | 'error' | 'maintenance';
  health: 'healthy' | 'unhealthy' | 'warning';
  instances: Array<{
    id: string;
    host: string;
    port: number;
    status: string;
    uptime: number;
    load: number;
  }>;
  endpoints: Array<{
    path: string;
    method: string;
    description: string;
    responseTime: number;
  }>;
  dependencies: string[];
  configuration: Record<string, any>;
  metrics: {
    requestsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
  };
}

export const microservicesAPI = {
  getServices: async (): Promise<Microservice[]> => {
    const { data } = await api.get('/microservices');
    return data;
  },
  
  getService: async (serviceId: string): Promise<Microservice> => {
    const { data } = await api.get(`/microservices/${serviceId}`);
    return data;
  },
  
  deployService: async (serviceData: any): Promise<Microservice> => {
    const { data } = await api.post('/microservices', serviceData);
    return data;
  },
  
  scaleService: async (serviceId: string, instances: number): Promise<void> => {
    await api.post(`/microservices/${serviceId}/scale`, { instances });
  },
};

export default microservicesAPI;