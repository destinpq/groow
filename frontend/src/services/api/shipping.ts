import { api } from './client';

// Backend POJO imports - Shipping Module
import {
  ShippingCarrierEntity,
  ShippingMethodEntity,
  ShippingZoneEntity,
  ShippingRateEntity,
  ShippingLabelEntity,
  ShippingTrackingEntity,
  ShippingPickupEntity,
  ShippingManifestEntity,
  ShippingPreferenceEntity,
  CalculateShippingRateRequest,
  CreateShippingLabelRequest,
  SchedulePickupRequest,
  UpdateTrackingRequest
} from '../../types/backend/shipping';

// API Response wrappers
interface ShippingAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedShippingResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Request types
export interface CreateCarrierRequest {
  name: string;
  code: string;
  config: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    testMode?: boolean;
    webhookUrl?: string;
  };
  capabilities: {
    trackingEnabled?: boolean;
    pickupAvailable?: boolean;
    internationalShipping?: boolean;
    signatureRequired?: boolean;
    insuranceAvailable?: boolean;
  };
  supportedCountries?: string[];
  supportedServices?: string[];
  logo?: string;
}

export interface UpdateCarrierRequest extends Partial<CreateCarrierRequest> {
  isActive?: boolean;
}

export interface CreateMethodRequest {
  carrierId: string;
  name: string;
  code: string;
  description?: string;
  serviceType: string;
  estimatedDays: {
    min: number;
    max: number;
  };
  pricing: {
    baseRate: number;
    freeShippingThreshold?: number;
    weightMultiplier?: number;
    dimensionMultiplier?: number;
    minimumCharge?: number;
    maximumCharge?: number;
  };
  restrictions?: {
    maxWeight?: number;
    maxDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    prohibitedItems?: string[];
    requiredDocuments?: string[];
  };
  availableZones?: string[];
}

export interface UpdateMethodRequest extends Partial<CreateMethodRequest> {
  isActive?: boolean;
}

export interface CreateZoneRequest {
  name: string;
  description?: string;
  coverage: {
    countries: string[];
    states?: string[];
    regions?: string[];
    postalCodes?: string[];
    cities?: string[];
  };
  restrictions?: {
    excludedAreas?: string[];
    specialRequirements?: string[];
  };
  priority?: number;
}

export interface UpdateZoneRequest extends Partial<CreateZoneRequest> {
  isActive?: boolean;
}

// Response types
export interface GetCarriersResponse {
  carriers: ShippingCarrierEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetMethodsResponse {
  methods: ShippingMethodEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetZonesResponse {
  zones: ShippingZoneEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CalculateRatesResponse {
  rates: {
    methodId: string;
    methodName: string;
    carrierId: string;
    carrierName: string;
    serviceType: string;
    price: number;
    estimatedDays: {
      min: number;
      max: number;
    };
    deliveryDate?: Date;
    freeShipping: boolean;
    transitTime: string;
    features: string[];
  }[];
  origin: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  destination: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  packages: any[];
}

export interface TrackingResponse {
  tracking: ShippingTrackingEntity;
  realTimeUpdates: boolean;
  nextUpdate?: Date;
}

export interface CreateLabelResponse {
  label: ShippingLabelEntity;
  tracking: ShippingTrackingEntity;
  estimatedDelivery?: Date;
}

export interface SchedulePickupResponse {
  pickup: ShippingPickupEntity;
  confirmationCode: string;
  instructions?: string;
}

// Legacy compatibility types
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

// Shipping API Service with backend POJOs integration
export const shippingAPI = {
  // ========================================
  // Carrier Management with typed POJOs
  // ========================================
  getCarriers: async (filters?: {
    isActive?: boolean;
    trackingEnabled?: boolean;
    pickupAvailable?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetCarriersResponse> => {
    const response = await api.get<PaginatedShippingResponse<ShippingCarrierEntity>>('/shipping/carriers', {
      params: filters,
    });
    return {
      carriers: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getCarrier: async (id: string): Promise<ShippingCarrierEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingCarrierEntity>>(`/shipping/carriers/${id}`);
    return response?.data?.data || response?.data;
  },

  createCarrier: async (data: CreateCarrierRequest): Promise<ShippingCarrierEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingCarrierEntity>>('/shipping/carriers', data);
    return response?.data?.data || response?.data;
  },

  updateCarrier: async (id: string, data: UpdateCarrierRequest): Promise<ShippingCarrierEntity> => {
    const response = await api.put<ShippingAPIResponse<ShippingCarrierEntity>>(`/shipping/carriers/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteCarrier: async (id: string): Promise<void> => {
    await api.delete(`/shipping/carriers/${id}`);
  },

  toggleCarrier: async (id: string, isActive: boolean): Promise<ShippingCarrierEntity> => {
    const response = await api.patch<ShippingAPIResponse<ShippingCarrierEntity>>(`/shipping/carriers/${id}/toggle`, { isActive });
    return response?.data?.data || response?.data;
  },

  testCarrierConnection: async (id: string): Promise<{ connected: boolean; error?: string }> => {
    const response = await api.post<ShippingAPIResponse<{ connected: boolean; error?: string }>>(`/shipping/carriers/${id}/test-connection`);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Shipping Methods with typed POJOs
  // ========================================
  getMethods: async (filters?: {
    carrierId?: string;
    isActive?: boolean;
    zoneId?: string;
    serviceType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetMethodsResponse> => {
    const response = await api.get<PaginatedShippingResponse<ShippingMethodEntity>>('/shipping/methods', {
      params: filters,
    });
    return {
      methods: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getMethod: async (id: string): Promise<ShippingMethodEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingMethodEntity>>(`/shipping/methods/${id}`);
    return response?.data?.data || response?.data;
  },

  createMethod: async (data: CreateMethodRequest): Promise<ShippingMethodEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingMethodEntity>>('/shipping/methods', data);
    return response?.data?.data || response?.data;
  },

  updateMethod: async (id: string, data: UpdateMethodRequest): Promise<ShippingMethodEntity> => {
    const response = await api.put<ShippingAPIResponse<ShippingMethodEntity>>(`/shipping/methods/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteMethod: async (id: string): Promise<void> => {
    await api.delete(`/shipping/methods/${id}`);
  },

  toggleMethod: async (id: string, isActive: boolean): Promise<ShippingMethodEntity> => {
    const response = await api.patch<ShippingAPIResponse<ShippingMethodEntity>>(`/shipping/methods/${id}/toggle`, { isActive });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Shipping Zones with typed POJOs
  // ========================================
  getZones: async (filters?: {
    isActive?: boolean;
    country?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetZonesResponse> => {
    const response = await api.get<PaginatedShippingResponse<ShippingZoneEntity>>('/shipping/zones', {
      params: filters,
    });
    return {
      zones: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getZone: async (id: string): Promise<ShippingZoneEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingZoneEntity>>(`/shipping/zones/${id}`);
    return response?.data?.data || response?.data;
  },

  createZone: async (data: CreateZoneRequest): Promise<ShippingZoneEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingZoneEntity>>('/shipping/zones', data);
    return response?.data?.data || response?.data;
  },

  updateZone: async (id: string, data: UpdateZoneRequest): Promise<ShippingZoneEntity> => {
    const response = await api.put<ShippingAPIResponse<ShippingZoneEntity>>(`/shipping/zones/${id}`, data);
    return response?.data?.data || response?.data;
  },

  deleteZone: async (id: string): Promise<void> => {
    await api.delete(`/shipping/zones/${id}`);
  },

  toggleZone: async (id: string, isActive: boolean): Promise<ShippingZoneEntity> => {
    const response = await api.patch<ShippingAPIResponse<ShippingZoneEntity>>(`/shipping/zones/${id}/toggle`, { isActive });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Rate Calculation with typed POJOs
  // ========================================
  calculateRates: async (data: CalculateShippingRateRequest): Promise<CalculateRatesResponse> => {
    const response = await api.post<ShippingAPIResponse<CalculateRatesResponse>>('/shipping/calculate-rates', data);
    return response?.data?.data || response?.data;
  },

  compareMethods: async (data: CalculateShippingRateRequest): Promise<{
    comparison: {
      cheapest: any;
      fastest: any;
      recommended: any;
      allRates: any[];
    };
  }> => {
    const response = await api.post<ShippingAPIResponse<{
      comparison: {
        cheapest: any;
        fastest: any;
        recommended: any;
        allRates: any[];
      };
    }>>('/shipping/compare-methods', data);
    return response?.data?.data || response?.data;
  },

  validateAddress: async (address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }): Promise<{
    valid: boolean;
    suggestions?: any[];
    normalized?: any;
  }> => {
    const response = await api.post<ShippingAPIResponse<{
      valid: boolean;
      suggestions?: any[];
      normalized?: any;
    }>>('/shipping/validate-address', { address });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Tracking with typed POJOs
  // ========================================
  trackShipment: async (trackingNumber: string, carrierId?: string): Promise<TrackingResponse> => {
    const response = await api.get<ShippingAPIResponse<TrackingResponse>>('/shipping/track', {
      params: { trackingNumber, carrierId },
    });
    return response?.data?.data || response?.data;
  },

  trackMultiple: async (trackingNumbers: string[]): Promise<TrackingResponse[]> => {
    const response = await api.post<ShippingAPIResponse<TrackingResponse[]>>('/shipping/track-multiple', {
      trackingNumbers,
    });
    return response?.data?.data || response?.data;
  },

  updateTrackingInfo: async (trackingNumber: string, data: UpdateTrackingRequest): Promise<ShippingTrackingEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingTrackingEntity>>(`/shipping/track/${trackingNumber}/update`, data);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Label Generation with typed POJOs
  // ========================================
  createLabel: async (data: CreateShippingLabelRequest): Promise<CreateLabelResponse> => {
    const response = await api.post<ShippingAPIResponse<CreateLabelResponse>>('/shipping/labels', data);
    return response?.data?.data || response?.data;
  },

  getLabel: async (id: string): Promise<ShippingLabelEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingLabelEntity>>(`/shipping/labels/${id}`);
    return response?.data?.data || response?.data;
  },

  voidLabel: async (id: string, reason?: string): Promise<ShippingLabelEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingLabelEntity>>(`/shipping/labels/${id}/void`, { reason });
    return response?.data?.data || response?.data;
  },

  downloadLabel: async (id: string, format?: string): Promise<Blob> => {
    const response = await api.get(`/shipping/labels/${id}/download`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // ========================================
  // Pickup Management with typed POJOs
  // ========================================
  schedulePickup: async (data: SchedulePickupRequest): Promise<SchedulePickupResponse> => {
    const response = await api.post<ShippingAPIResponse<SchedulePickupResponse>>('/shipping/pickups', data);
    return response?.data?.data || response?.data;
  },

  getPickups: async (filters?: {
    status?: string;
    carrierId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    pickups: ShippingPickupEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get<PaginatedShippingResponse<ShippingPickupEntity>>('/shipping/pickups', {
      params: filters,
    });
    return {
      pickups: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  getPickup: async (id: string): Promise<ShippingPickupEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingPickupEntity>>(`/shipping/pickups/${id}`);
    return response?.data?.data || response?.data;
  },

  cancelPickup: async (id: string, reason?: string): Promise<ShippingPickupEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingPickupEntity>>(`/shipping/pickups/${id}/cancel`, { reason });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Manifest Management with typed POJOs
  // ========================================
  createManifest: async (data: {
    carrierId: string;
    date: Date;
    shipmentIds: string[];
  }): Promise<ShippingManifestEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingManifestEntity>>('/shipping/manifests', data);
    return response?.data?.data || response?.data;
  },

  getManifests: async (filters?: {
    carrierId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    manifests: ShippingManifestEntity[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get<PaginatedShippingResponse<ShippingManifestEntity>>('/shipping/manifests', {
      params: filters,
    });
    return {
      manifests: (response?.data?.data || response?.data)?.items,
      total: (response?.data?.data || response?.data)?.total,
      page: (response?.data?.data || response?.data)?.page,
      totalPages: (response?.data?.data || response?.data)?.totalPages
    };
  },

  submitManifest: async (id: string): Promise<ShippingManifestEntity> => {
    const response = await api.post<ShippingAPIResponse<ShippingManifestEntity>>(`/shipping/manifests/${id}/submit`);
    return response?.data?.data || response?.data;
  },

  downloadManifest: async (id: string): Promise<Blob> => {
    const response = await api.get(`/shipping/manifests/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ========================================
  // Preferences with typed POJOs
  // ========================================
  getPreferences: async (userId?: string): Promise<ShippingPreferenceEntity> => {
    const response = await api.get<ShippingAPIResponse<ShippingPreferenceEntity>>('/shipping/preferences', {
      params: { userId },
    });
    return response?.data?.data || response?.data;
  },

  updatePreferences: async (data: Partial<ShippingPreferenceEntity>): Promise<ShippingPreferenceEntity> => {
    const response = await api.put<ShippingAPIResponse<ShippingPreferenceEntity>>('/shipping/preferences', data);
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Analytics & Reports with typed POJOs
  // ========================================
  getShippingAnalytics: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    carrierId?: string;
    methodId?: string;
  }): Promise<{
    overview: {
      totalShipments: number;
      totalCost: number;
      averageCost: number;
      onTimeDelivery: number;
    };
    carrierPerformance: {
      carrierId: string;
      carrierName: string;
      shipments: number;
      cost: number;
      onTimeRate: number;
      avgTransitTime: number;
    }[];
    methodUsage: {
      methodId: string;
      methodName: string;
      usage: number;
      percentage: number;
      avgCost: number;
    }[];
    trends: {
      date: string;
      shipments: number;
      cost: number;
    }[];
  }> => {
    const response = await api.get<ShippingAPIResponse<any>>('/shipping/analytics', {
      params: filters,
    });
    return response?.data?.data || response?.data;
  },

  getCostAnalysis: async (filters?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'carrier' | 'method' | 'zone';
  }): Promise<{
    totalCost: number;
    savings: number;
    breakdown: {
      category: string;
      cost: number;
      percentage: number;
      shipments: number;
    }[];
    recommendations: string[];
  }> => {
    const response = await api.get<ShippingAPIResponse<any>>('/shipping/cost-analysis', {
      params: filters,
    });
    return response?.data?.data || response?.data;
  },

  // ========================================
  // Legacy Compatibility Methods
  // ========================================
  // Legacy rate calculation for backward compatibility
  calculateRatesLegacy: async (data: CalculateRateData): Promise<ShippingRate[]> => {
    const requestData: CalculateShippingRateRequest = {
      origin: {
        postalCode: data.origin.postalCode,
        city: data.origin.city,
        state: data.origin.state,
        country: data.origin.country,
      },
      destination: {
        postalCode: data.destination.postalCode,
        city: data.destination.city,
        state: data.destination.state,
        country: data.destination.country,
      },
      packages: data.packages.map(pkg => ({
        weight: pkg.weight,
        dimensions: {
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
        },
      })),
    };

    const response = await shippingAPI.calculateRates(requestData);
    
    // Transform to legacy format
    return response.rates.map((rate: any) => ({
      methodId: rate.methodId,
      methodName: rate.methodName,
      carrierName: rate.carrierName,
      price: rate.price,
      estimatedDays: `${rate.estimatedDays.min}-${rate.estimatedDays.max} days`,
      freeShipping: rate.freeShipping,
    }));
  },

  // Legacy tracking for backward compatibility
  trackShipmentLegacy: async (trackingNumber: string, carrier?: string): Promise<TrackingInfo> => {
    const response = await shippingAPI.trackShipment(trackingNumber, carrier);
    
    // Transform to legacy format
    return {
      trackingNumber: response.tracking.trackingNumber,
      carrier: response.tracking.carrierId,
      carrierCode: response.tracking.carrierId,
      status: response.tracking.status as any,
      estimatedDelivery: response.tracking.estimatedDelivery?.toISOString(),
      events: response.tracking.events.map((event: any) => ({
        timestamp: event.timestamp.toISOString(),
        location: event.location,
        description: event.description,
        status: event.status,
      })),
    };
  },
};

export default shippingAPI;
