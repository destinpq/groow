/**
 * DevOps Pipeline API Services
 * CI/CD pipeline management and automation
 */
import { api } from './client';

export interface Pipeline {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'disabled';
  stages: Array<{
    name: string;
    type: 'build' | 'test' | 'deploy';
    status: 'pending' | 'running' | 'success' | 'failed';
  }>;
}

export const devOpsAPI = {
  getPipelines: async (): Promise<Pipeline[]> => {
    const { data } = await api.get('/devops/pipelines');
    return data;
  },
  
  runPipeline: async (pipelineId: string): Promise<void> => {
    await api.post(`/devops/pipelines/${pipelineId}/run`);
  },
};

export default devOpsAPI;