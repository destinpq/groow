import api from './client';

// Types
export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  logo?: string;
  apiKey?: string;
  apiSecret?: string;
  enabled: boolean;
  trackingEnabled: boolean;
  pickupAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  id: string;
  carrierId: string;
  carrierName: string;
  name: string;
  code: string;
  description: string;
  estimatedDays: string;
  baseRate: number;
  freeShippingThreshold?: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  postalCodes?: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingRate {
  methodId: string;
  methodName: string;
  carrierName: string;
  price: number;
  estimatedDays: string;
  freeShipping: boolean;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  carrierCode: string;
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'failed';
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status: string;
}

export interface CalculateRateData {
  origin: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
  destination: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
  packages: {
    weight: number;
    length: number;
    width: number;
    height: number;
    weightUnit: 'kg' | 'lb';
    dimensionUnit: 'cm' | 'in';
  }[];
}

export interface CreateCarrierData {
  name: string;
  code: string;
  apiKey?: string;
  apiSecret?: string;
  logo?: string;
  trackingEnabled?: boolean;
  pickupAvailable?: boolean;
}

export interface CreateMethodData {
  carrierId: string;
  name: string;
  code: string;
  description: string;
  estimatedDays: string;
  baseRate: number;
  freeShippingThreshold?: number;
}

// Shipping API Service
export const shippingAPI = {
  // Carriers
  getCarriers: async (): Promise<ShippingCarrier[]> => {
    const response = await api.get<ShippingCarrier[]>('/shipping/carriers');
    return response.data;
  },

  getCarrier: async (id: string): Promise<ShippingCarrier> => {
    const response = await api.get<ShippingCarrier>(`/shipping/carriers/${id}`);
    return response.data;
  },

  createCarrier: async (data: CreateCarrierData): Promise<ShippingCarrier> => {
    const response = await api.post<ShippingCarrier>('/shipping/carriers', data);
    return response.data;
  },

  updateCarrier: async (id: string, data: Partial<CreateCarrierData>): Promise<ShippingCarrier> => {
    const response = await api.put<ShippingCarrier>(`/shipping/carriers/${id}`, data);
    return response.data;
  },

  deleteCarrier: async (id: string): Promise<void> => {
    await api.delete(`/shipping/carriers/${id}`);
  },

  toggleCarrier: async (id: string, enabled: boolean): Promise<ShippingCarrier> => {
    const response = await api.patch<ShippingCarrier>(`/shipping/carriers/${id}/toggle`, { enabled });
    return response.data;
  },

  // Shipping Methods
  getMethods: async (carrierId?: string): Promise<ShippingMethod[]> => {
    const response = await api.get<ShippingMethod[]>('/shipping/methods', {
      params: { carrierId },
    });
    return response.data;
  },

  getMethod: async (id: string): Promise<ShippingMethod> => {
    const response = await api.get<ShippingMethod>(`/shipping/methods/${id}`);
    return response.data;
  },

  createMethod: async (data: CreateMethodData): Promise<ShippingMethod> => {
    const response = await api.post<ShippingMethod>('/shipping/methods', data);
    return response.data;
  },

  updateMethod: async (id: string, data: Partial<CreateMethodData>): Promise<ShippingMethod> => {
    const response = await api.put<ShippingMethod>(`/shipping/methods/${id}`, data);
    return response.data;
  },

  deleteMethod: async (id: string): Promise<void> => {
    await api.delete(`/shipping/methods/${id}`);
  },

  toggleMethod: async (id: string, enabled: boolean): Promise<ShippingMethod> => {
    const response = await api.patch<ShippingMethod>(`/shipping/methods/${id}/toggle`, { enabled });
    return response.data;
  },

  // Rate Calculation
  calculateRates: async (data: CalculateRateData): Promise<ShippingRate[]> => {
    const response = await api.post<ShippingRate[]>('/shipping/calculate-rates', data);
    return response.data;
  },

  // Tracking
  trackShipment: async (trackingNumber: string, carrier?: string): Promise<TrackingInfo> => {
    const response = await api.get<TrackingInfo>('/shipping/track', {
      params: { trackingNumber, carrier },
    });
    return response.data;
  },

  // Shipping Zones
  getZones: async (): Promise<ShippingZone[]> => {
    const response = await api.get<ShippingZone[]>('/shipping/zones');
    return response.data;
  },

  createZone: async (data: Omit<ShippingZone, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShippingZone> => {
    const response = await api.post<ShippingZone>('/shipping/zones', data);
    return response.data;
  },

  updateZone: async (id: string, data: Partial<Omit<ShippingZone, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ShippingZone> => {
    const response = await api.put<ShippingZone>(`/shipping/zones/${id}`, data);
    return response.data;
  },

  deleteZone: async (id: string): Promise<void> => {
    await api.delete(`/shipping/zones/${id}`);
  },
};

export default shippingAPI;
