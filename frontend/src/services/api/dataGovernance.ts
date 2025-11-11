/**
 * Data Governance API Services
 * Data quality, lineage, and compliance management
 */
import { api } from './client';

export interface DataGovernance {
  id: string;
  dataset: string;
  owner: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  qualityScore: number;
  compliance: string[];
}

export const dataGovernanceAPI = {
  getDatasets: async (): Promise<DataGovernance[]> => {
    const { data } = await api.get('/governance/datasets');
    return data;
  },
  
  classifyData: async (datasetId: string, classification: string): Promise<void> => {
    await api.put(`/governance/datasets/${datasetId}/classify`, { classification });
  },
};

export default dataGovernanceAPI;