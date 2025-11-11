/**
 * Event Streaming API Services
 * Real-time event processing and stream analytics
 */
import { api } from './client';

export interface EventStream {
  id: string;
  name: string;
  topic: string;
  status: 'active' | 'paused';
  throughput: number;
  partitions: number;
}

export const eventStreamingAPI = {
  getStreams: async (): Promise<EventStream[]> => {
    const { data } = await api.get('/events/streams');
    return data;
  },
  
  publishEvent: async (streamId: string, event: any): Promise<void> => {
    await api.post(`/events/streams/${streamId}/publish`, event);
  },
};

export default eventStreamingAPI;