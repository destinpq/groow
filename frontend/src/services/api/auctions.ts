import api from './client';

// Types
export interface Auction {
  id: string;
  productId: string;
  product?: any;
  startPrice: number;
  currentBid: number;
  buyNowPrice?: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  totalBids: number;
  winnerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  isWinning: boolean;
  createdAt: string;
}

export interface CreateBidData {
  auctionId: string;
  amount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auctions API
export const auctionsAPI = {
  // Get all auctions
  getAll: async (params?: {
    status?: 'upcoming' | 'active' | 'ended';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Auction>> => {
    const response = await api.get<PaginatedResponse<Auction>>('/auctions', { params });
    return response.data;
  },

  // Get auction by ID
  getById: async (id: string): Promise<Auction> => {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
  },

  // Place bid
  placeBid: async (data: CreateBidData): Promise<Bid> => {
    const response = await api.post<Bid>('/auctions/bids', data);
    return response.data;
  },

  // Get auction bids
  getBids: async (auctionId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Bid>> => {
    const response = await api.get<PaginatedResponse<Bid>>(`/auctions/${auctionId}/bids`, { params });
    return response.data;
  },

  // Get my bids
  getMyBids: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Bid>> => {
    const response = await api.get<PaginatedResponse<Bid>>('/auctions/my-bids', { params });
    return response.data;
  },

  // Buy now
  buyNow: async (auctionId: string): Promise<{
    orderId: string;
    auction: Auction;
  }> => {
    const response = await api.post<{
      orderId: string;
      auction: Auction;
    }>(`/auctions/${auctionId}/buy-now`);
    return response.data;
  },

  // Watch auction
  watch: async (auctionId: string): Promise<void> => {
    const response = await api.post<void>(`/auctions/${auctionId}/watch`);
    return response.data;
  },

  // Unwatch auction
  unwatch: async (auctionId: string): Promise<void> => {
    const response = await api.delete<void>(`/auctions/${auctionId}/watch`);
    return response.data;
  },
};

export default auctionsAPI;
