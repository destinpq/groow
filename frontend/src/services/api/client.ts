import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// Base API URL configuration
const baseUrl = process.env.REACT_APP_API_URL || 'https://groow-api.destinpq.com';
const API_BASE_URL = baseUrl;

// Request retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryCondition: (error: AxiosError) => {
    // Retry on network errors and 5xx responses
    return !error.response || error.response.status >= 500;
  },
};

// Request queue for handling concurrent requests
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private maxConcurrent = 10;
  private currentRequests = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.currentRequests++;
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.currentRequests--;
          this.processNext();
        }
      });

      this.processNext();
    });
  }

  private processNext() {
    if (this.queue.length > 0 && this.currentRequests < this.maxConcurrent) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        nextRequest();
      }
    }
  }
}

const requestQueue = new RequestQueue();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper function for retry logic
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retryCount = 0
): Promise<AxiosResponse<T>> => {
  try {
    return await requestFn();
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (
      retryCount < RETRY_CONFIG.maxRetries &&
      RETRY_CONFIG.retryCondition(axiosError)
    ) {
      console.log(`🔄 Retrying request (attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
      await sleep(RETRY_CONFIG.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      return retryRequest(requestFn, retryCount + 1);
    }
    
    throw error;
  }
};

// Request timing map for performance monitoring
const requestTiming = new Map<string, number>();

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Store request start time for performance monitoring
    const requestId = `${config.method}-${config.url}-${Date.now()}`;
    requestTiming.set(requestId, Date.now());
    (config as any).__requestId = requestId;
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 50) + '...' : null
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate response time
    const requestId = (response.config as any).__requestId;
    const startTime = requestTiming.get(requestId);
    const responseTime = startTime ? Date.now() - startTime : 0;
    
    // Clean up timing data
    if (requestId) {
      requestTiming.delete(requestId);
    }
    
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 API Response:', {
        url: response.config.url,
        status: response.status,
        responseTime: `${responseTime}ms`,
        data: response.data,
      });
    }

    // Log slow requests
    if (responseTime > 3000) {
      console.warn(`🐌 Slow API response (${responseTime}ms):`, response.config.url);
    }
    
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Clean up timing data
    const requestId = (originalRequest as any).__requestId;
    if (requestId) {
      requestTiming.delete(requestId);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          console.log('🔄 Attempting token refresh...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { access_token } = response.data?.data || response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          console.log('✅ Token refreshed successfully');
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors or if refresh failed
    if (error.response?.status === 401) {
      console.log('🚪 Unauthorized - redirecting to login');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token'); 
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle network errors with user-friendly messages
    let errorMessage = 'An error occurred';
    
    if (!error.response) {
      // Network error
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (error.response.status >= 500) {
      // Server error
      errorMessage = 'Server error. Please try again later.';
    } else if (error.response.status === 429) {
      // Rate limiting
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    } else {
      // Use server-provided message
      errorMessage = error.response?.data?.message || error.message || errorMessage;
    }
    
    // Show error message for non-auth errors
    if (error.response?.status !== 401) {
      message.error(errorMessage);
    }

    // Log error in development with additional details
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// Enhanced API methods with retry logic and queue management
export const api = {
  // GET request with retry
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return requestQueue.add(() => retryRequest(() => apiClient.get<T>(url, config)));
  },

  // POST request with retry
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return requestQueue.add(() => retryRequest(() => apiClient.post<T>(url, data, config)));
  },

  // PUT request with retry
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return requestQueue.add(() => retryRequest(() => apiClient.put<T>(url, data, config)));
  },

  // PATCH request with retry
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return requestQueue.add(() => retryRequest(() => apiClient.patch<T>(url, data, config)));
  },

  // DELETE request with retry
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return requestQueue.add(() => retryRequest(() => apiClient.delete<T>(url, config)));
  },

  // Upload file with progress tracking
  upload: <T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<AxiosResponse<T>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      timeout: 60000, // Increase timeout for file uploads
    });
  },

  // Download file with progress
  download: (url: string, filename: string, onProgress?: (progress: number) => void): Promise<void> => {
    return apiClient.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  },

  // Batch requests with concurrency control
  batch: async <T = any>(requests: Array<() => Promise<AxiosResponse<T>>>): Promise<AxiosResponse<T>[]> => {
    return Promise.all(requests.map(request => requestQueue.add(request)));
  },

  // Health check endpoint
  healthCheck: (): Promise<AxiosResponse<{ status: string; timestamp: string }>> => {
    return apiClient.get('/health');
  },

  // Cancel all pending requests
  cancelAll: () => {
    // This would require implementing request cancellation tokens
    console.log('Cancelling all pending requests...');
  },
};

// Export types for better TypeScript support
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  errors?: any[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default api;
export { apiClient };
