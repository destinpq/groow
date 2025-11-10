// Backend Warranty Entity Types - Generated from Common Entity Patterns

export interface WarrantyEntity {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  warrantyNumber: string;
  type: string; // manufacturer, extended, lifetime, third_party
  status: string; // active, expired, cancelled, claimed, void
  
  // Product Information
  product: {
    id: string;
    name: string;
    sku: string;
    model: string;
    manufacturer: string;
    serialNumber?: string;
    purchasePrice: number;
  };
  
  // Coverage Details
  coverage: {
    planId?: string;
    planName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    durationMonths: number;
    coverageType: string; // full, limited, parts_only, labor_only
    deductible?: number;
    maxClaimAmount?: number;
    claimsPerYear?: number;
    totalClaimsLimit?: number;
  };
  
  // Included Services
  services: {
    accidentalDamage: boolean;
    theft: boolean;
    lossProtection: boolean;
    wearAndTear: boolean;
    manufacturing: boolean;
    cosmetic: boolean;
    liquid: boolean;
    powerSurge: boolean;
    dataRecovery: boolean;
    onSiteRepair: boolean;
    pickupDelivery: boolean;
    loaner: boolean;
    concierge: boolean;
  };
  
  // Terms & Conditions
  terms: {
    termsUrl: string;
    exclusions: string[];
    requirements: string[];
    cancellationPolicy: string;
    transferable: boolean;
    prorated: boolean;
  };
  
  // Purchase Information
  purchase: {
    purchaseDate: Date;
    purchasePrice: number;
    paymentMethod: string;
    invoiceUrl?: string;
    salesRepId?: string;
  };
  
  // Registration
  registration: {
    registeredAt: Date;
    registrationMethod: string; // online, phone, mail, auto
    registrationNumber?: string;
    verificationStatus: string; // pending, verified, rejected
    verificationNotes?: string;
  };
  
  // Provider Information
  provider: {
    providerId: string;
    providerName: string;
    contactPhone: string;
    contactEmail: string;
    websiteUrl?: string;
    claimProcess: string;
    supportHours: string;
  };
  
  // Claims Summary
  claimsSummary: {
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    pendingClaims: number;
    totalPaidOut: number;
    remainingCoverage: number;
  };
  
  // Notifications
  notifications: {
    expirationReminder: boolean;
    claimUpdates: boolean;
    renewalOffers: boolean;
    lastNotificationSent?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WarrantyPlanEntity {
  id: string;
  name: string;
  code: string;
  description: string;
  providerId: string;
  category: string; // electronics, appliances, automotive, etc.
  
  // Coverage Configuration
  coverage: {
    durationMonths: number;
    maxRetailPrice?: number;
    minRetailPrice?: number;
    deductible?: number;
    maxClaimAmount?: number;
    claimsPerYear?: number;
    totalClaimsLimit?: number;
  };
  
  // Pricing
  pricing: {
    type: string; // fixed, percentage, tiered
    basePrice?: number;
    percentage?: number;
    priceRanges?: {
      min: number;
      max: number;
      price: number;
    }[];
    currency: string;
  };
  
  // Service Inclusions
  services: {
    accidentalDamage: boolean;
    theft: boolean;
    lossProtection: boolean;
    wearAndTear: boolean;
    manufacturing: boolean;
    cosmetic: boolean;
    liquid: boolean;
    powerSurge: boolean;
    dataRecovery: boolean;
    onSiteRepair: boolean;
    pickupDelivery: boolean;
    loaner: boolean;
    concierge: boolean;
    extendedSupport: boolean;
  };
  
  // Eligibility
  eligibility: {
    productCategories: string[];
    brands: string[];
    excludedBrands: string[];
    minAge: number; // days
    maxAge: number; // days
    newItemsOnly: boolean;
    refurbishedAllowed: boolean;
  };
  
  // Terms
  terms: {
    termsUrl: string;
    exclusions: string[];
    requirements: string[];
    cancellationPeriod: number; // days
    cancellationFee?: number;
    transferable: boolean;
    prorated: boolean;
  };
  
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WarrantyClaimEntity {
  id: string;
  claimNumber: string;
  warrantyId: string;
  customerId: string;
  status: string; // submitted, reviewing, approved, rejected, in_repair, completed, cancelled
  
  // Issue Information
  issue: {
    type: string; // defect, accidental_damage, theft, loss, wear, malfunction
    category: string; // hardware, software, cosmetic, functional
    description: string;
    occurredAt: Date;
    reportedAt: Date;
    symptoms: string[];
    previousRepairs: boolean;
    underWarranty: boolean;
  };
  
  // Evidence
  evidence: {
    id: string;
    type: string; // photo, video, document, receipt, report
    filename: string;
    url: string;
    description?: string;
    uploadedAt: Date;
  }[];
  
  // Assessment
  assessment: {
    assessorId?: string;
    assessorName?: string;
    assessedAt?: Date;
    findings: string;
    recommendation: string; // approve, reject, need_more_info
    coverageVerified: boolean;
    estimatedCost?: number;
    laborHours?: number;
    partsRequired?: string[];
  };
  
  // Resolution
  resolution?: {
    type: string; // repair, replace, refund, credit
    description: string;
    approvedAt: Date;
    approvedBy: string;
    estimatedCompletion?: Date;
    actualCompletion?: Date;
    cost: number;
    refundAmount?: number;
    replacementProductId?: string;
    repairFacility?: {
      name: string;
      address: string;
      contact: string;
      trackingNumber?: string;
    };
  };
  
  // Communication
  communications: {
    id: string;
    type: string; // email, sms, call, note
    direction: string; // inbound, outbound
    subject?: string;
    message: string;
    sentBy: string;
    sentAt: Date;
    read: boolean;
  }[];
  
  // Tracking
  tracking: {
    currentStep: number;
    steps: {
      step: number;
      name: string;
      description: string;
      completedAt?: Date;
      notes?: string;
    }[];
    estimatedCompletion?: Date;
    lastUpdated: Date;
  };
  
  // Financial
  financial: {
    claimAmount: number;
    approvedAmount: number;
    deductible: number;
    taxAmount?: number;
    totalPayment: number;
    paymentMethod?: string;
    paymentDate?: Date;
    paymentReference?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WarrantyProviderEntity {
  id: string;
  name: string;
  code: string;
  type: string; // manufacturer, third_party, insurance, retailer
  
  // Contact Information
  contact: {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    website?: string;
    claimsPhone?: string;
    claimsEmail?: string;
    claimsWebsite?: string;
  };
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Service Details
  service: {
    supportHours: string;
    languages: string[];
    claimProcess: string;
    avgResponseTime: number; // hours
    avgResolutionTime: number; // days
    customerSatisfaction: number;
    automatedClaims: boolean;
    onlinePortal: boolean;
  };
  
  // Coverage Areas
  coverage: {
    countries: string[];
    regions: string[];
    serviceAreas: string[];
    shipsTo: string[];
    pickupAreas: string[];
  };
  
  // Business Information
  business: {
    licenseNumber?: string;
    taxId?: string;
    rating: string; // A+, A, B+, etc.
    accreditation: string[];
    established: Date;
    employeeCount?: number;
    annualRevenue?: number;
  };
  
  // Performance Metrics
  metrics: {
    totalWarranties: number;
    activeClaims: number;
    avgClaimTime: number; // days
    approvalRate: number;
    customerRating: number;
    complaintRate: number;
    financialStrength: string;
  };
  
  isActive: boolean;
  isPreferred: boolean;
  contractStart?: Date;
  contractEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WarrantyRegistrationEntity {
  id: string;
  warrantyId?: string;
  customerId: string;
  productId: string;
  
  // Product Details
  product: {
    name: string;
    model: string;
    serialNumber: string;
    manufacturer: string;
    purchaseDate: Date;
    purchasePrice: number;
    retailer: string;
    receiptUrl?: string;
  };
  
  // Registration Details
  registration: {
    method: string; // online, phone, mail, qr_code, auto
    source: string; // website, app, receipt, packaging
    language: string;
    marketingConsent: boolean;
    promotionalEmails: boolean;
    surveyParticipation: boolean;
  };
  
  // Verification
  verification: {
    status: string; // pending, verified, rejected, expired
    method: string; // receipt, serial, purchase_verification
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
    documents: string[];
  };
  
  // Customer Information
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  
  status: string; // pending, completed, rejected, expired
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface CreateWarrantyRequest {
  orderId: string;
  planId: string;
  productId: string;
  customerId: string;
  purchaseDate: Date;
  serialNumber?: string;
  registrationData?: {
    marketingConsent: boolean;
    promotionalEmails: boolean;
  };
}

export interface CreateWarrantyClaimRequest {
  warrantyId: string;
  issueType: string;
  issueCategory: string;
  description: string;
  occurredAt: Date;
  symptoms: string[];
  previousRepairs?: boolean;
  evidence?: {
    type: string;
    filename: string;
    description?: string;
  }[];
}

export interface UpdateClaimRequest {
  description?: string;
  status?: string;
  resolution?: {
    type: string;
    description: string;
    estimatedCompletion?: Date;
  };
}

export interface RegisterWarrantyRequest {
  productId: string;
  serialNumber: string;
  purchaseDate: Date;
  purchasePrice: number;
  retailer: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  marketingConsent?: boolean;
  promotionalEmails?: boolean;
}