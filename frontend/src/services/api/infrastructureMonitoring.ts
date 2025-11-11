/**
 * Infrastructure Monitoring API Services
 * Server monitoring, resource tracking, and alerting
 */
import { api } from './client';

export interface Infrastructure {
  id: string;
  name: string;
  type: 'server' | 'container' | 'vm' | 'function';
  status: 'online' | 'offline' | 'warning' | 'critical';
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  alerts: Array<{
    level: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

export const infrastructureMonitoringAPI = {
  getInfrastructure: async (): Promise<Infrastructure[]> => {
    const { data } = await api.get('/infrastructure');
    return data;
  },
  
  getMetrics: async (infrastructureId: string, timeRange: string): Promise<any> => {
    const { data } = await api.get(`/infrastructure/${infrastructureId}/metrics`, {
      params: { timeRange }
    });
    return data;
  },
  
  createAlert: async (infrastructureId: string, alert: any): Promise<void> => {
    await api.post(`/infrastructure/${infrastructureId}/alerts`, alert);
  },
};

export default infrastructureMonitoringAPI;