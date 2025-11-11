/**
 * Service Mesh API Services
 * Service-to-service communication and traffic management
 */
import { api } from './client';

export interface ServiceMesh {
  id: string;
  namespace: string;
  services: Array<{
    name: string;
    version: string;
    traffic: number;
  }>;
}

export const serviceMeshAPI = {
  getMeshes: async (): Promise<ServiceMesh[]> => {
    const { data } = await api.get('/service-mesh');
    return data;
  },
  
  routeTraffic: async (meshId: string, routing: any): Promise<void> => {
    await api.post(`/service-mesh/${meshId}/route`, routing);
  },
};

export default serviceMeshAPI;