import { api } from './client';

// API Response wrapper types
export interface CurrencyAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface PaginatedCurrencyResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========================================
// Currency Types
// ========================================

export interface Currency {
  id: string;
  code: string; // ISO 4217 currency code (USD, EUR, GBP, etc.)
  name: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  isActive: boolean;
  isDefault: boolean;
  exchangeRate: number;
  lastUpdated: string;
  countryCode?: string;
  flag?: string;
  displayFormat: string; // e.g., "$1,234.56" or "1.234,56 €"
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
  source: 'manual' | 'api' | 'bank';
  provider?: string;
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  timestamp: string;
  fees?: number;
  markup?: number;
}

export interface PriceLocalization {
  productId: string;
  prices: {
    [currencyCode: string]: {
      basePrice: number;
      salePrice?: number;
      markup?: number;
      roundingRule?: 'none' | 'up' | 'down' | 'nearest';
      customPrice?: number;
      isCustom: boolean;
    };
  };
  lastUpdated: string;
}

export interface CurrencySettings {
  id: string;
  defaultCurrency: string;
  enabledCurrencies: string[];
  autoUpdateRates: boolean;
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  rateProvider: 'fixer' | 'openexchangerates' | 'currencylayer' | 'exchangeratesapi' | 'manual';
  apiKey?: string;
  markupPercentage: number;
  roundingRules: {
    [currencyCode: string]: {
      rule: 'none' | 'up' | 'down' | 'nearest';
      precision: number;
    };
  };
  fallbackCurrency: string;
  checkoutCurrencies: string[];
  displayMultipleCurrencies: boolean;
  showCurrencySelector: boolean;
  detectUserCurrency: boolean;
  geolocationEnabled: boolean;
}

export interface CurrencyStats {
  totalCurrencies: number;
  activeCurrencies: number;
  totalConversions: number;
  topCurrencies: {
    code: string;
    name: string;
    conversions: number;
    revenue: number;
    percentage: number;
  }[];
  revenueByCurrency: {
    [currencyCode: string]: number;
  };
  conversionVolume: {
    date: string;
    conversions: number;
    volume: number;
  }[];
  exchangeRateHistory: {
    date: string;
    rates: {
      [currencyPair: string]: number;
    };
  }[];
}

export interface GeoLocationCurrency {
  countryCode: string;
  countryName: string;
  detectedCurrency: string;
  confidence: number;
  alternativeCurrencies: string[];
  timezone: string;
  ipAddress?: string;
}

export interface CurrencyValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface BulkPriceUpdate {
  productIds: string[];
  targetCurrency: string;
  updateMethod: 'convert' | 'markup' | 'custom';
  markupPercentage?: number;
  customPrices?: { [productId: string]: number };
  roundingRule?: 'none' | 'up' | 'down' | 'nearest';
  applyToSalePrices: boolean;
}

export interface CurrencyFilters {
  isActive?: boolean;
  codes?: string[];
  search?: string;
  sortBy?: 'code' | 'name' | 'rate' | 'lastUpdated';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ========================================
// Multi-Currency API Service
// ========================================

export const currencyAPI = {
  // ========================================
  // Currency Management
  // ========================================

  getAll: async (filters?: CurrencyFilters): Promise<{
    currencies: Currency[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get<PaginatedCurrencyResponse<Currency>>('/currencies', {
      params: filters,
    });
    return {
      currencies: response.data.data.items,
      total: response.data.data.total,
      page: response.data.data.page,
      limit: response.data.data.limit
    };
  },

  getById: async (id: string): Promise<Currency> => {
    const response = await api.get<CurrencyAPIResponse<Currency>>(`/currencies/${id}`);
    return response.data.data;
  },

  getByCode: async (code: string): Promise<Currency> => {
    const response = await api.get<CurrencyAPIResponse<Currency>>(`/currencies/code/${code}`);
    return response.data.data;
  },

  create: async (currencyData: Omit<Currency, 'id' | 'lastUpdated'>): Promise<Currency> => {
    const response = await api.post<CurrencyAPIResponse<Currency>>('/currencies', currencyData);
    return response.data.data;
  },

  update: async (id: string, updateData: Partial<Currency>): Promise<Currency> => {
    const response = await api.put<CurrencyAPIResponse<Currency>>(`/currencies/${id}`, updateData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/currencies/${id}`);
  },

  activate: async (id: string): Promise<Currency> => {
    const response = await api.post(`/currencies/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string): Promise<Currency> => {
    const response = await api.post(`/currencies/${id}/deactivate`);
    return response.data;
  },

  setDefault: async (id: string): Promise<Currency> => {
    const response = await api.post(`/currencies/${id}/set-default`);
    return response.data;
  },

  // ========================================
  // Exchange Rates
  // ========================================

  getExchangeRates: async (baseCurrency?: string): Promise<ExchangeRate[]> => {
    const response = await api.get<CurrencyAPIResponse<ExchangeRate[]>>('/currencies/exchange-rates', {
      params: { baseCurrency },
    });
    return response.data.data;
  },

  getExchangeRate: async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
    const response = await api.get<CurrencyAPIResponse<ExchangeRate>>(`/currencies/exchange-rates/${fromCurrency}/${toCurrency}`);
    return response.data.data;
  },

  updateExchangeRate: async (
    fromCurrency: string,
    toCurrency: string,
    rate: number,
    source: ExchangeRate['source'] = 'manual'
  ): Promise<ExchangeRate> => {
    const response = await api.put(`/currencies/exchange-rates/${fromCurrency}/${toCurrency}`, {
      rate,
      source,
    });
    return response.data;
  },

  refreshExchangeRates: async (currencyCodes?: string[]): Promise<{
    updated: number;
    failed: string[];
    rates: ExchangeRate[];
  }> => {
    const response = await api.post('/currencies/exchange-rates/refresh', {
      currencyCodes,
    });
    return response.data;
  },

  getExchangeRateHistory: async (
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<{
    rates: { date: string; rate: number }[];
    average: number;
    min: number;
    max: number;
    volatility: number;
  }> => {
    const response = await api.get(`/currencies/exchange-rates/${fromCurrency}/${toCurrency}/history`, {
      params: { days },
    });
    return response.data;
  },

  // ========================================
  // Currency Conversion
  // ========================================

  convert: async (
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    includeMarkup: boolean = true
  ): Promise<CurrencyConversion> => {
    const response = await api.post<CurrencyAPIResponse<CurrencyConversion>>('/currencies/convert', {
      fromCurrency,
      toCurrency,
      amount,
      includeMarkup,
    });
    return response.data.data;
  },

  bulkConvert: async (conversions: {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
  }[]): Promise<CurrencyConversion[]> => {
    const response = await api.post('/currencies/bulk-convert', { conversions });
    return response.data;
  },

  getConversionHistory: async (filters?: {
    fromCurrency?: string;
    toCurrency?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{
    conversions: CurrencyConversion[];
    total: number;
    stats: {
      totalVolume: number;
      averageAmount: number;
      mostPopularPair: string;
    };
  }> => {
    const response = await api.get('/currencies/conversions', {
      params: filters,
    });
    return response.data;
  },

  // ========================================
  // Price Localization
  // ========================================

  getProductPrices: async (productId: string): Promise<PriceLocalization> => {
    const response = await api.get(`/currencies/products/${productId}/prices`);
    return response.data;
  },

  updateProductPrices: async (
    productId: string,
    prices: PriceLocalization['prices']
  ): Promise<PriceLocalization> => {
    const response = await api.put(`/currencies/products/${productId}/prices`, { prices });
    return response.data;
  },

  bulkUpdatePrices: async (updateData: BulkPriceUpdate): Promise<{
    updated: number;
    failed: string[];
    results: PriceLocalization[];
  }> => {
    const response = await api.post('/currencies/products/bulk-update-prices', updateData);
    return response.data;
  },

  syncProductPrices: async (
    productIds: string[],
    baseCurrency: string,
    targetCurrencies: string[],
    markupPercentage: number = 0
  ): Promise<{
    synced: number;
    failed: string[];
    results: PriceLocalization[];
  }> => {
    const response = await api.post('/currencies/products/sync-prices', {
      productIds,
      baseCurrency,
      targetCurrencies,
      markupPercentage,
    });
    return response.data;
  },

  // ========================================
  // Currency Settings
  // ========================================

  getSettings: async (): Promise<CurrencySettings> => {
    const response = await api.get('/currencies/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<CurrencySettings>): Promise<CurrencySettings> => {
    const response = await api.put('/currencies/settings', settings);
    return response.data;
  },

  testRateProvider: async (provider: string, apiKey?: string): Promise<{
    success: boolean;
    rates: ExchangeRate[];
    error?: string;
    responseTime: number;
  }> => {
    const response = await api.post('/currencies/settings/test-provider', {
      provider,
      apiKey,
    });
    return response.data;
  },

  // ========================================
  // Geolocation & Detection
  // ========================================

  detectCurrency: async (ipAddress?: string): Promise<GeoLocationCurrency> => {
    const response = await api.post('/currencies/detect', { ipAddress });
    return response.data;
  },

  getSupportedCountries: async (): Promise<{
    [countryCode: string]: {
      name: string;
      currency: string;
      flag: string;
    };
  }> => {
    const response = await api.get('/currencies/countries');
    return response.data;
  },

  // ========================================
  // Analytics & Statistics
  // ========================================

  getStats: async (dateRange?: { start: string; end: string }): Promise<CurrencyStats> => {
    const response = await api.get('/currencies/stats', {
      params: dateRange,
    });
    return response.data;
  },

  getCurrencyUsage: async (currencyCode: string, days: number = 30): Promise<{
    usage: {
      date: string;
      conversions: number;
      volume: number;
      revenue: number;
    }[];
    trends: {
      conversionsChange: number;
      volumeChange: number;
      revenueChange: number;
    };
  }> => {
    const response = await api.get(`/currencies/${currencyCode}/usage`, {
      params: { days },
    });
    return response.data;
  },

  getRevenueBreakdown: async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<{
    breakdown: {
      currency: string;
      revenue: number;
      orders: number;
      percentage: number;
    }[];
    total: number;
    period: string;
  }> => {
    const response = await api.get('/currencies/revenue-breakdown', {
      params: { period },
    });
    return response.data;
  },

  // ========================================
  // Validation & Utilities
  // ========================================

  validateCurrency: async (currencyData: Partial<Currency>): Promise<CurrencyValidation> => {
    const response = await api.post('/currencies/validate', currencyData);
    return response.data;
  },

  formatAmount: async (
    amount: number,
    currencyCode: string,
    options?: {
      showSymbol?: boolean;
      showCode?: boolean;
      precision?: number;
    }
  ): Promise<string> => {
    const response = await api.post('/currencies/format', {
      amount,
      currencyCode,
      options,
    });
    return response.data.formatted;
  },

  parseAmount: async (
    formattedAmount: string,
    currencyCode: string
  ): Promise<{
    amount: number;
    currency: string;
    isValid: boolean;
  }> => {
    const response = await api.post('/currencies/parse', {
      formattedAmount,
      currencyCode,
    });
    return response.data;
  },

  // ========================================
  // Import/Export
  // ========================================

  exportCurrencies: async (format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<Blob> => {
    const response = await api.get('/currencies/export', {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  importCurrencies: async (
    file: File,
    options?: {
      skipValidation?: boolean;
      updateExisting?: boolean;
      dryRun?: boolean;
    }
  ): Promise<{
    imported: number;
    updated: number;
    failed: number;
    errors: any[];
    results: Currency[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await api.post('/currencies/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  exportExchangeRates: async (
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    baseCurrency?: string
  ): Promise<Blob> => {
    const response = await api.get('/currencies/exchange-rates/export', {
      params: { format, baseCurrency },
      responseType: 'blob',
    });
    return response.data;
  },

  // ========================================
  // Bulk Operations
  // ========================================

  bulkActivate: async (currencyIds: string[]): Promise<{
    activated: number;
    failed: string[];
  }> => {
    const response = await api.post('/currencies/bulk/activate', { currencyIds });
    return response.data;
  },

  bulkDeactivate: async (currencyIds: string[]): Promise<{
    deactivated: number;
    failed: string[];
  }> => {
    const response = await api.post('/currencies/bulk/deactivate', { currencyIds });
    return response.data;
  },

  bulkDelete: async (currencyIds: string[]): Promise<{
    deleted: number;
    failed: string[];
  }> => {
    const response = await api.post('/currencies/bulk/delete', { currencyIds });
    return response.data;
  },

  bulkUpdateRates: async (rates: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  }[]): Promise<{
    updated: number;
    failed: string[];
    results: ExchangeRate[];
  }> => {
    const response = await api.post('/currencies/bulk/update-rates', { rates });
    return response.data;
  },

  // ========================================
  // Search & Discovery
  // ========================================

  search: async (query: string, filters?: CurrencyFilters): Promise<Currency[]> => {
    const response = await api.get('/currencies/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  getSuggestions: async (partial: string): Promise<{
    currencies: Currency[];
    countries: string[];
  }> => {
    const response = await api.get('/currencies/suggestions', {
      params: { partial },
    });
    return response.data;
  },

  getPopularCurrencies: async (limit: number = 10): Promise<Currency[]> => {
    const response = await api.get('/currencies/popular', {
      params: { limit },
    });
    return response.data;
  },
};

export default currencyAPI;