// Backend Tax Entities - Finance Module

import { BaseEntity, PaginationResponse } from './pagination';
import { CustomerEntity } from './customer';
import { ProductEntity } from './product';
import { OrderEntity } from './order';

// Core Tax Rate Entity
export interface TaxRateEntity extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  
  // Geographic Scope
  jurisdiction: TaxJurisdiction;
  
  // Rate Configuration
  rate: number; // percentage
  type: TaxRateType;
  category: TaxCategory;
  
  // Applicability
  applicability: TaxApplicability;
  
  // Status & Scheduling
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  
  // Time-based Rules
  effectiveDate: Date;
  expiryDate?: Date;
  
  // Configuration
  configuration: TaxRateConfiguration;
  
  // Relations
  exemptions: TaxExemptionEntity[];
  calculations: TaxCalculationEntity[];
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  version: number;
}

// Tax Calculation Entity
export interface TaxCalculationEntity extends BaseEntity {
  id: string;
  
  // Reference
  order?: OrderEntity;
  orderId?: string;
  customerId?: string;
  customer?: CustomerEntity;
  
  // Location Details
  billingLocation: TaxLocation;
  shippingLocation?: TaxLocation;
  
  // Calculation Input
  items: TaxCalculationItem[];
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  
  // Calculation Results
  results: TaxCalculationResult;
  
  // Applied Rules
  appliedRates: AppliedTaxRate[];
  appliedExemptions: AppliedTaxExemption[];
  
  // Status & Metadata
  status: TaxCalculationStatus;
  calculatedAt: Date;
  calculationVersion: string;
  source: string; // 'cart', 'checkout', 'order', 'refund', 'manual'
  
  // Compliance
  complianceData: TaxComplianceData;
  
  // Relations
  exemption?: TaxExemptionEntity;
  exemptionId?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Tax Exemption Entity
export interface TaxExemptionEntity extends BaseEntity {
  id: string;
  
  // Customer Information
  customer: CustomerEntity;
  customerId: string;
  
  // Exemption Details
  type: TaxExemptionType;
  category: TaxExemptionCategory;
  status: TaxExemptionStatus;
  
  // Certificate Information
  certificate: TaxExemptionCertificate;
  
  // Scope & Limitations
  scope: TaxExemptionScope;
  
  // Validity
  issuedDate: Date;
  effectiveDate: Date;
  expiryDate?: Date;
  
  // Verification
  verification: TaxExemptionVerification;
  
  // Usage Tracking
  usageCount: number;
  lastUsedAt?: Date;
  
  // Relations
  calculations: TaxCalculationEntity[];
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

// Tax Report Entity
export interface TaxReportEntity extends BaseEntity {
  id: string;
  
  // Report Configuration
  reportType: TaxReportType;
  period: TaxReportPeriod;
  jurisdiction: TaxJurisdiction;
  
  // Data Summary
  summary: TaxReportSummary;
  
  // Detailed Data
  calculations: string[]; // calculation IDs
  exemptions: string[]; // exemption IDs
  
  // File Information
  fileUrl?: string;
  fileFormat: 'pdf' | 'csv' | 'xlsx' | 'xml';
  fileSize?: number;
  
  // Status & Processing
  status: TaxReportStatus;
  generatedAt?: Date;
  submittedAt?: Date;
  
  // Relations
  generatedBy: string;
  submittedBy?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Tax Configuration Entity
export interface TaxConfigurationEntity extends BaseEntity {
  id: string;
  name: string;
  description: string;
  
  // Global Settings
  globalSettings: TaxGlobalSettings;
  
  // Rate Management
  rateManagement: TaxRateManagement;
  
  // Calculation Rules
  calculationRules: TaxCalculationRules;
  
  // Exemption Rules
  exemptionRules: TaxExemptionRules;
  
  // Compliance Settings
  compliance: TaxComplianceSettings;
  
  // Integration Settings
  integration: TaxIntegrationSettings;
  
  // Status
  isActive: boolean;
  isDefault: boolean;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Supporting Interfaces

export enum TaxRateType {
  SALES_TAX = 'sales_tax',
  VALUE_ADDED_TAX = 'value_added_tax',
  GOODS_SERVICES_TAX = 'goods_services_tax',
  EXCISE_TAX = 'excise_tax',
  IMPORT_DUTY = 'import_duty',
  CARBON_TAX = 'carbon_tax',
  LUXURY_TAX = 'luxury_tax',
  DIGITAL_SERVICES_TAX = 'digital_services_tax'
}

export enum TaxCategory {
  STANDARD = 'standard',
  REDUCED = 'reduced',
  ZERO_RATED = 'zero_rated',
  EXEMPT = 'exempt',
  SPECIAL = 'special'
}

export enum TaxExemptionType {
  RESALE = 'resale',
  NONPROFIT = 'nonprofit',
  GOVERNMENT = 'government',
  EDUCATION = 'education',
  AGRICULTURE = 'agriculture',
  MEDICAL = 'medical',
  EXPORT = 'export',
  MANUFACTURING = 'manufacturing'
}

export enum TaxExemptionCategory {
  ENTITY_BASED = 'entity_based',
  PRODUCT_BASED = 'product_based',
  USE_BASED = 'use_based',
  LOCATION_BASED = 'location_based'
}

export enum TaxExemptionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked'
}

export enum TaxCalculationStatus {
  DRAFT = 'draft',
  CALCULATED = 'calculated',
  APPLIED = 'applied',
  FINALIZED = 'finalized',
  VOIDED = 'voided'
}

export enum TaxReportType {
  SALES_TAX = 'sales_tax',
  VAT_RETURN = 'vat_return',
  GST_RETURN = 'gst_return',
  EXEMPTION_SUMMARY = 'exemption_summary',
  JURISDICTION_SUMMARY = 'jurisdiction_summary',
  COMPLIANCE_REPORT = 'compliance_report'
}

export enum TaxReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  FAILED = 'failed'
}

export interface TaxJurisdiction {
  country: string;
  countryCode: string;
  state?: string;
  stateCode?: string;
  province?: string;
  provinceCode?: string;
  city?: string;
  zipCode?: string;
  postalCode?: string;
  district?: string;
  region?: string;
  level: 'country' | 'state' | 'province' | 'city' | 'local';
}

export interface TaxLocation {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  stateCode?: string;
  zipCode: string;
  country: string;
  countryCode: string;
  isValidated: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TaxApplicability {
  productCategories?: string[];
  productTypes?: string[];
  excludedProducts?: string[];
  customerTypes?: string[];
  excludedCustomers?: string[];
  orderTypes?: string[];
  channels?: string[];
  minimumAmount?: number;
  maximumAmount?: number;
}

export interface TaxRateConfiguration {
  // Rounding Rules
  rounding: {
    method: 'round' | 'floor' | 'ceiling';
    precision: number;
  };
  
  // Compound Rules
  compound: {
    isCompound: boolean;
    compoundWith?: string[]; // other rate IDs
    compoundOrder?: number;
  };
  
  // Display Rules
  display: {
    showInBreakdown: boolean;
    label: string;
    description?: string;
  };
  
  // Calculation Rules
  calculation: {
    includeTaxInPrice: boolean;
    taxOnShipping: boolean;
    taxOnDiscount: boolean;
    capAmount?: number;
  };
}

export interface TaxCalculationItem {
  productId?: string;
  product?: ProductEntity;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  taxCategory?: string;
  isExempt: boolean;
  exemptionReason?: string;
  appliedRates: {
    rateId: string;
    rateName: string;
    rate: number;
    taxAmount: number;
  }[];
}

export interface TaxCalculationResult {
  // Totals
  subtotal: number;
  taxableAmount: number;
  exemptAmount: number;
  totalTaxAmount: number;
  total: number;
  currency: string;
  
  // Tax Breakdown
  breakdown: TaxBreakdownItem[];
  
  // Summary by Jurisdiction
  jurisdictionSummary: {
    jurisdiction: TaxJurisdiction;
    taxableAmount: number;
    taxAmount: number;
    rate: number;
  }[];
  
  // Summary by Tax Type
  typeSummary: {
    type: TaxRateType;
    taxableAmount: number;
    taxAmount: number;
    rate: number;
  }[];
}

export interface TaxBreakdownItem {
  rateId: string;
  rateName: string;
  type: TaxRateType;
  jurisdiction: TaxJurisdiction;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
  isCompound: boolean;
}

export interface AppliedTaxRate {
  rate: TaxRateEntity;
  rateId: string;
  appliedRate: number;
  taxableAmount: number;
  taxAmount: number;
  appliedAt: Date;
}

export interface AppliedTaxExemption {
  exemption: TaxExemptionEntity;
  exemptionId: string;
  exemptAmount: number;
  exemptionReason: string;
  appliedAt: Date;
}

export interface TaxExemptionCertificate {
  number: string;
  type: string;
  issuingAuthority: string;
  issuedDate: Date;
  expiryDate?: Date;
  documentUrl?: string;
  verificationCode?: string;
  status: 'pending' | 'valid' | 'invalid' | 'expired';
}

export interface TaxExemptionScope {
  jurisdictions?: TaxJurisdiction[];
  productCategories?: string[];
  taxTypes?: TaxRateType[];
  maxAmount?: number;
  usageLimit?: number;
  validFrom: Date;
  validTo?: Date;
}

export interface TaxExemptionVerification {
  isVerified: boolean;
  verificationMethod: 'manual' | 'automated' | 'third_party';
  verifiedAt?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  nextVerificationDate?: Date;
  verificationHistory: {
    date: Date;
    status: 'verified' | 'failed' | 'pending';
    method: string;
    notes?: string;
  }[];
}

export interface TaxComplianceData {
  transactionType: string;
  businessType: string;
  industryCode?: string;
  compliance: {
    [jurisdiction: string]: {
      reportingRequired: boolean;
      reportingPeriod?: string;
      nextFilingDate?: Date;
      registrationNumber?: string;
    };
  };
}

export interface TaxReportPeriod {
  type: 'monthly' | 'quarterly' | 'annually' | 'custom';
  startDate: Date;
  endDate: Date;
  year: number;
  quarter?: number;
  month?: number;
}

export interface TaxReportSummary {
  totalTransactions: number;
  totalTaxableAmount: number;
  totalTaxAmount: number;
  totalExemptAmount: number;
  jurisdictionBreakdown: {
    jurisdiction: TaxJurisdiction;
    transactions: number;
    taxableAmount: number;
    taxAmount: number;
    exemptAmount: number;
  }[];
  typeBreakdown: {
    type: TaxRateType;
    transactions: number;
    taxableAmount: number;
    taxAmount: number;
  }[];
}

export interface TaxGlobalSettings {
  defaultCurrency: string;
  roundingPrecision: number;
  includeTaxInPrice: boolean;
  requireTaxValidation: boolean;
  enableExemptions: boolean;
  enableReporting: boolean;
}

export interface TaxRateManagement {
  autoUpdateRates: boolean;
  rateProvider?: string;
  updateFrequency?: string;
  backupRates: boolean;
  rateValidation: boolean;
}

export interface TaxCalculationRules {
  calculationMethod: 'line_item' | 'order_total';
  roundingMethod: 'round' | 'floor' | 'ceiling';
  compoundTaxes: boolean;
  taxOnShipping: boolean;
  taxOnDiscounts: boolean;
  maxTaxAmount?: number;
}

export interface TaxExemptionRules {
  requireCertificate: boolean;
  autoApproval: boolean;
  verificationRequired: boolean;
  expiryNotification: boolean;
  renewalProcess: boolean;
}

export interface TaxComplianceSettings {
  enableReporting: boolean;
  autoSubmission: boolean;
  retentionPeriod: number; // years
  auditTrail: boolean;
  complianceChecks: boolean;
}

export interface TaxIntegrationSettings {
  provider?: string;
  apiKey?: string;
  webhookUrl?: string;
  syncFrequency?: string;
  backupCalculation: boolean;
}

// API Response Types
export interface TaxAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

export interface PaginatedTaxResponse<T> {
  success: boolean;
  data: PaginationResponse<T>;
  message?: string;
  timestamp: Date;
}

// Request DTOs
export interface CreateTaxRateRequest {
  name: string;
  description?: string;
  jurisdiction: TaxJurisdiction;
  rate: number;
  type: TaxRateType;
  category: TaxCategory;
  applicability?: Partial<TaxApplicability>;
  effectiveDate?: Date;
  expiryDate?: Date;
  priority?: number;
  configuration?: Partial<TaxRateConfiguration>;
}

export interface UpdateTaxRateRequest extends Partial<CreateTaxRateRequest> {
  isActive?: boolean;
}

export interface TaxCalculationRequest {
  // Location
  billingLocation: TaxLocation;
  shippingLocation?: TaxLocation;
  
  // Customer
  customerId?: string;
  customerType?: string;
  exemptionId?: string;
  
  // Order Details
  items: {
    productId?: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    category?: string;
    taxCategory?: string;
  }[];
  subtotal: number;
  shippingAmount?: number;
  discountAmount?: number;
  
  // Options
  includeTaxInPrice?: boolean;
  currency?: string;
  calculationDate?: Date;
}

export interface CreateTaxExemptionRequest {
  customerId: string;
  type: TaxExemptionType;
  category: TaxExemptionCategory;
  certificate: Omit<TaxExemptionCertificate, 'status'>;
  scope: TaxExemptionScope;
  issuedDate: Date;
  effectiveDate: Date;
  expiryDate?: Date;
}

export interface UpdateTaxExemptionRequest extends Partial<CreateTaxExemptionRequest> {
  status?: TaxExemptionStatus;
}

export interface TaxReportRequest {
  reportType: TaxReportType;
  period: TaxReportPeriod;
  jurisdiction?: TaxJurisdiction;
  fileFormat?: 'pdf' | 'csv' | 'xlsx' | 'xml';
  includeDetails?: boolean;
  filters?: {
    customerIds?: string[];
    productCategories?: string[];
    minAmount?: number;
    maxAmount?: number;
  };
}

// Response DTOs
export interface GetTaxRatesResponse {
  rates: TaxRateEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetTaxCalculationsResponse {
  calculations: TaxCalculationEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetTaxExemptionsResponse {
  exemptions: TaxExemptionEntity[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TaxStatsResponse {
  overview: {
    totalRates: number;
    activeRates: number;
    totalCalculations: number;
    totalExemptions: number;
    totalTaxCollected: number;
    avgTaxRate: number;
  };
  
  byJurisdiction: {
    jurisdiction: TaxJurisdiction;
    rateCount: number;
    avgRate: number;
    totalCollected: number;
    exemptionCount: number;
  }[];
  
  byType: {
    type: TaxRateType;
    rateCount: number;
    avgRate: number;
    totalCollected: number;
  }[];
  
  trends: {
    date: string;
    calculations: number;
    totalTax: number;
    avgRate: number;
  }[];
  
  compliance: {
    jurisdiction: TaxJurisdiction;
    nextFilingDate?: Date;
    filingStatus: string;
    outstandingAmount?: number;
  }[];
}

export interface TaxValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  validatedData: {
    location?: TaxLocation;
    rates?: TaxRateEntity[];
    exemption?: TaxExemptionEntity;
  };
}