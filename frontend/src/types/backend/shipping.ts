// Backend Shipping Entity Types - Generated from Common Entity Patterns

export interface ShippingCarrierEntity {
  id: string;
  name: string;
  code: string;
  logo?: string;
  config: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    testMode?: boolean;
    webhookUrl?: string;
  };
  capabilities: {
    trackingEnabled: boolean;
    pickupAvailable: boolean;
    internationalShipping: boolean;
    signatureRequired: boolean;
    insuranceAvailable: boolean;
  };
  isActive: boolean;
  supportedCountries: string[];
  supportedServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingMethodEntity {
  id: string;
  carrierId: string;
  name: string;
  code: string;
  description?: string;
  serviceType: string; // standard, express, overnight, economy
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
  restrictions: {
    maxWeight?: number;
    maxDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    prohibitedItems?: string[];
    requiredDocuments?: string[];
  };
  isActive: boolean;
  availableZones: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingZoneEntity {
  id: string;
  name: string;
  description?: string;
  coverage: {
    countries: string[];
    states?: string[];
    regions?: string[];
    postalCodes?: string[];
    cities?: string[];
  };
  restrictions: {
    excludedAreas?: string[];
    specialRequirements?: string[];
  };
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingRateEntity {
  id: string;
  methodId: string;
  zoneId: string;
  baseRate: number;
  weightRanges: {
    min: number;
    max: number;
    rate: number;
  }[];
  dimensionRates: {
    type: 'volume' | 'dimensional_weight';
    formula: string;
    rate: number;
  }[];
  surcharges: {
    type: string;
    name: string;
    amount: number;
    isPercentage: boolean;
  }[];
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingLabelEntity {
  id: string;
  orderId: string;
  carrierId: string;
  methodId: string;
  trackingNumber: string;
  labelUrl: string;
  labelFormat: string; // pdf, png, zpl
  status: string; // created, printed, voided
  shippingCost: number;
  insurance?: {
    value: number;
    cost: number;
  };
  dimensions: {
    weight: number;
    length: number;
    width: number;
    height: number;
    weightUnit: string;
    dimensionUnit: string;
  };
  addresses: {
    from: {
      name: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    to: {
      name: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingTrackingEntity {
  id: string;
  trackingNumber: string;
  carrierId: string;
  orderId: string;
  status: string; // pending, in_transit, out_for_delivery, delivered, exception
  currentLocation?: {
    city: string;
    state?: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  signedBy?: string;
  events: {
    timestamp: Date;
    status: string;
    description: string;
    location: string;
    facility?: string;
  }[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface ShippingPickupEntity {
  id: string;
  carrierId: string;
  requestId: string;
  status: string; // requested, scheduled, completed, cancelled
  pickupDate: Date;
  pickupTime: {
    start: string;
    end: string;
  };
  address: {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  instructions?: string;
  packages: {
    count: number;
    totalWeight: number;
    description: string;
  };
  confirmationCode?: string;
  cost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingManifestEntity {
  id: string;
  carrierId: string;
  manifestId: string;
  date: Date;
  shipments: {
    trackingNumber: string;
    orderId: string;
    weight: number;
    value: number;
  }[];
  totalShipments: number;
  totalWeight: number;
  totalValue: number;
  status: string; // created, submitted, closed
  submittedAt?: Date;
  manifestUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingPreferenceEntity {
  id: string;
  userId: string;
  userType: 'customer' | 'vendor';
  defaultMethod?: string;
  preferences: {
    signatureRequired: boolean;
    insured: boolean;
    leaveAtDoor: boolean;
    weekendDelivery: boolean;
    notificationPreferences: {
      sms: boolean;
      email: boolean;
      app: boolean;
    };
  };
  savedAddresses: {
    id: string;
    label: string;
    address: {
      name: string;
      company?: string;
      address1: string;
      address2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    isDefault: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CalculateShippingRateRequest {
  origin: {
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  destination: {
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  packages: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value?: number;
    description?: string;
  }[];
  options?: {
    signature?: boolean;
    insurance?: boolean;
    saturdayDelivery?: boolean;
  };
}

export interface CreateShippingLabelRequest {
  orderId: string;
  carrierId: string;
  methodId: string;
  fromAddress: ShippingLabelEntity['addresses']['from'];
  toAddress: ShippingLabelEntity['addresses']['to'];
  packages: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value?: number;
    description?: string;
  }[];
  options?: {
    signature?: boolean;
    insurance?: { value: number };
    saturdayDelivery?: boolean;
  };
}

export interface SchedulePickupRequest {
  carrierId: string;
  address: ShippingPickupEntity['address'];
  pickupDate: string;
  timeWindow: {
    start: string;
    end: string;
  };
  packages: {
    count: number;
    totalWeight: number;
    description: string;
  };
  instructions?: string;
}

export interface UpdateTrackingRequest {
  trackingNumber: string;
  status: string;
  location?: {
    city: string;
    state?: string;
    country: string;
  };
  description?: string;
  timestamp?: Date;
}