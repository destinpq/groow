/**
 * Message Queue API Services
 * Asynchronous message processing and queue management
 */
import { api } from './client';

export interface MessageQueue {
  id: string;
  name: string;
  type: 'FIFO' | 'Standard';
  messages: number;
  consumers: number;
  throughput: number;
}

export const messageQueueAPI = {
  getQueues: async (): Promise<MessageQueue[]> => {
    const { data } = await api.get('/queues');
    return data;
  },
  
  sendMessage: async (queueId: string, message: any): Promise<void> => {
    await api.post(`/queues/${queueId}/messages`, message);
  },
};

export default messageQueueAPI;