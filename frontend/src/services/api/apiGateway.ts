/**
 * API Gateway Management Services
 * API routing, rate limiting, and gateway configuration
 */
import { api } from './client';

export interface Gateway {
  id: string;
  name: string;
  routes: Array<{
    path: string;
    method: string;
    backend: string;
  }>;
  rateLimit: {
    requests: number;
    window: string;
  };
}

export const apiGatewayAPI = {
  getGateways: async (): Promise<Gateway[]> => {
    const { data } = await api.get('/gateway');
    return data;
  },
  
  createRoute: async (gatewayId: string, route: any): Promise<void> => {
    await api.post(`/gateway/${gatewayId}/routes`, route);
  },
};

export default apiGatewayAPI;