/**
 * Container Orchestration API Services
 * Docker and Kubernetes management
 */
import { api } from './client';

export interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'failed';
  ports: number[];
  resources: {
    cpu: string;
    memory: string;
  };
}

export const containerOrchestratorAPI = {
  getContainers: async (): Promise<Container[]> => {
    const { data } = await api.get('/containers');
    return data;
  },
  
  deployContainer: async (containerData: any): Promise<Container> => {
    const { data } = await api.post('/containers', containerData);
    return data;
  },
};

export default containerOrchestratorAPI;