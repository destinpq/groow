/**
 * Safe API Response Extractor
 * Handles all possible backend response formats safely
 * Prevents "Cannot read property" errors
 */

export interface SafeResponse<T> {
  data: T;
  total?: number;
  meta?: any;
  success?: boolean;
  message?: string;
}

/**
 * Safely extract data from any API response format
 * Handles: response.data.data, response.data, or direct response
 */
export function safeExtractData<T>(response: any, defaultValue: T): T {
  // Try multiple possible locations
  const data = response?.data?.data ?? response?.data ?? response ?? defaultValue;
  return data;
}

/**
 * Safely extract array data
 * Always returns an array, never undefined
 */
export function safeExtractArray<T>(response: any): T[] {
  const data = response?.data?.data ?? response?.data ?? response ?? [];
  return Array.isArray(data) ? data : [];
}

/**
 * Safely extract paginated response
 */
export function safeExtractPaginated<T>(response: any): { data: T[]; total: number; meta: any } {
  const data = safeExtractArray<T>(response);
  const total = response?.data?.meta?.total ?? response?.meta?.total ?? response?.total ?? data.length;
  const meta = response?.data?.meta ?? response?.meta ?? {};
  
  return { data, total, meta };
}

/**
 * Safely extract single item
 */
export function safeExtractItem<T>(response: any, defaultValue: T | null = null): T | null {
  const data = response?.data?.data ?? response?.data ?? response;
  return data ?? defaultValue;
}

/**
 * Check if response is successful
 */
export function isSuccessResponse(response: any): boolean {
  return response?.success !== false && 
         (response?.status === 200 || response?.status === 201 ||
          response?.data?.success !== false);
}

/**
 * Wrap API call with safe extraction
 */
export async function safeAPICall<T>(
  apiCall: Promise<any>,
  options: {
    extractArray?: boolean;
    extractPaginated?: boolean;
    defaultValue?: any;
  } = {}
): Promise<T> {
  try {
    const response = await apiCall;
    
    if (options.extractArray) {
      return safeExtractArray(response) as T;
    }
    
    if (options.extractPaginated) {
      return safeExtractPaginated(response) as T;
    }
    
    return safeExtractData(response, options.defaultValue ?? null) as T;
  } catch (error) {
    console.error('API call failed:', error);
    if (options.extractArray) {
      return [] as T;
    }
    if (options.defaultValue !== undefined) {
      return options.defaultValue;
    }
    throw error;
  }
}

