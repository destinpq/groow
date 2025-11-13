/**
 * Standardized API Response Types
 * Ensures type-safe and null-safe API response handling
 */

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode?: number;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(response: any): response is APIResponse<T> {
  return response && response.success === true && 'data' in response;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && response.success === false;
}

/**
 * Safely extract data from API response
 * Returns null if data doesn't exist or response failed
 */
export function extractData<T>(response: any, defaultValue: T | null = null): T | null {
  if (isSuccessResponse<T>(response)) {
    return response.data ?? defaultValue;
  }
  return defaultValue;
}

/**
 * Safely extract array data from API response
 * Always returns an array (empty if no data)
 */
export function extractArrayData<T>(response: any): T[] {
  if (isSuccessResponse<T[]>(response)) {
    return Array.isArray(response.data) ? response.data : [];
  }
  if (response?.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
}

/**
 * Safely extract paginated data
 */
export function extractPaginatedData<T>(response: any): { data: T[]; total: number; page: number } {
  const data = extractArrayData<T>(response);
  const meta = response?.meta || {};
  
  return {
    data,
    total: meta.total || data.length,
    page: meta.page || 1,
  };
}

