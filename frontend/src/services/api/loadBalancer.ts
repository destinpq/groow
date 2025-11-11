/**
 * Load Balancer API Services
 * Traffic distribution and load balancing management
 */
import { api } from './client';

export interface LoadBalancer {
  id: string;
  name: string;
  algorithm: 'round_robin' | 'least_connections' | 'weighted';
  targets: Array<{
    id: string;
    host: string;
    port: number;
    weight: number;
    health: 'healthy' | 'unhealthy';
  }>;
  traffic: {
    requests: number;
    connections: number;
    bandwidth: number;
  };
}

export const loadBalancerAPI = {
  getBalancers: async (): Promise<LoadBalancer[]> => {
    const { data } = await api.get('/load-balancers');
    return data;
  },
  
  addTarget: async (balancerId: string, target: any): Promise<void> => {
    await api.post(`/load-balancers/${balancerId}/targets`, target);
  },
};

export default loadBalancerAPI;