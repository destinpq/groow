/**
 * API Helper Utilities
 * Provides safe API response handling and error management
 */

import { message as antdMessage } from 'antd';
import type { APIResponse, ErrorResponse } from '@/types/api-response';

/**
 * Handle API response safely
 * Automatically shows error messages and extracts data
 */
export async function handleAPIResponse<T>(
  apiCall: Promise<any>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    silent?: boolean;
  }
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await apiCall;
    
    // Check if response is successful
    if (response?.success || response?.data) {
      if (options?.successMessage && !options?.silent) {
        antdMessage.success(options.successMessage);
      }
      
      return {
        data: response.data || response,
        error: null
      };
    }
    
    // Handle error response
    const errorMsg = response?.message || options?.errorMessage || 'Operation failed';
    if (!options?.silent) {
      antdMessage.error(errorMsg);
    }
    
    return {
      data: null,
      error: errorMsg
    };
    
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || 
                     error?.message || 
                     options?.errorMessage || 
                     'An error occurred';
    
    if (!options?.silent) {
      antdMessage.error(errorMsg);
    }
    
    return {
      data: null,
      error: errorMsg
    };
  }
}

/**
 * Safely get nested property from object
 */
export function safeGet(obj: any, path: string, defaultValue: any = null): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * Format API error for display
 */
export function formatAPIError(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (Array.isArray(error?.response?.data?.errors)) {
    return error.response.data.errors.join(', ');
  }
  
  return 'An unexpected error occurred';
}

/**
 * Retry API call with exponential backoff
 */
export async function retryAPI<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

/**
 * Check if data exists and is not empty
 */
export function hasData(data: any): boolean {
  if (data === null || data === undefined) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return true;
}

/**
 * Normalize API response to standard format
 */
export function normalizeResponse<T>(response: any): APIResponse<T> {
  // Already in correct format
  if (response?.success !== undefined && response?.data !== undefined) {
    return response as APIResponse<T>;
  }
  
  // Wrap raw data
  return {
    success: true,
    data: response,
    message: 'Success'
  };
}

