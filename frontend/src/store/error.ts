import { create } from 'zustand';
import { message } from 'antd';

// Error types for better error handling
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  errors: { [key: string]: ApiError };
  validationErrors: { [key: string]: ValidationError[] };
  loading: LoadingState;
  
  // Actions
  setError: (key: string, error: ApiError) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  setValidationErrors: (key: string, errors: ValidationError[]) => void;
  clearValidationErrors: (key: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
  handleApiError: (key: string, error: any) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
}

export const useErrorStore = create<ErrorState>((set, get) => ({
  errors: {},
  validationErrors: {},
  loading: {},

  setError: (key: string, error: ApiError) => {
    set((state) => ({
      errors: { ...state.errors, [key]: error }
    }));
  },

  clearError: (key: string) => {
    set((state) => ({
      errors: Object.fromEntries(
        Object.entries(state.errors).filter(([k]) => k !== key)
      )
    }));
  },

  clearAllErrors: () => {
    set({ errors: {}, validationErrors: {} });
  },

  setValidationErrors: (key: string, errors: ValidationError[]) => {
    set((state) => ({
      validationErrors: { ...state.validationErrors, [key]: errors }
    }));
  },

  clearValidationErrors: (key: string) => {
    set((state) => ({
      validationErrors: Object.fromEntries(
        Object.entries(state.validationErrors).filter(([k]) => k !== key)
      )
    }));
  },

  setLoading: (key: string, loading: boolean) => {
    set((state) => ({
      loading: { ...state.loading, [key]: loading }
    }));
  },

  clearLoading: (key: string) => {
    set((state) => ({
      loading: Object.fromEntries(
        Object.entries(state.loading).filter(([k]) => k !== key)
      )
    }));
  },

  handleApiError: (key: string, error: any) => {
    console.error(`API Error [${key}]:`, error);
    
    let apiError: ApiError = {
      message: 'An unexpected error occurred',
    };

    if (error?.response?.data) {
      const errorData = error.response.data;
      
      // Handle validation errors
      if (errorData.validationErrors) {
        get().setValidationErrors(key, errorData.validationErrors);
        apiError.message = 'Please check the form for validation errors';
      } else {
        // Handle general API errors
        apiError = {
          message: errorData.message || errorData.error || 'An error occurred',
          code: errorData.code || error.response.status?.toString(),
          details: errorData,
        };
      }
    } else if (error?.message) {
      apiError.message = error.message;
    } else if (typeof error === 'string') {
      apiError.message = error;
    }

    get().setError(key, apiError);
    
    // Auto-show error message for critical errors
    if (apiError.code && ['401', '403', '500'].includes(apiError.code)) {
      message.error(apiError.message);
    }
  },

  showSuccess: (msg: string) => {
    message.success(msg);
  },

  showError: (msg: string) => {
    message.error(msg);
  },

  showWarning: (msg: string) => {
    message.warning(msg);
  },
}));

// Custom hook for API operations with automatic error handling
export const useApiOperation = () => {
  const { setLoading, handleApiError, clearError, clearValidationErrors, showSuccess } = useErrorStore();

  const executeApiCall = async <T = any>(
    key: string,
    apiCall: () => Promise<T>,
    options?: {
      successMessage?: string;
      hideSuccessMessage?: boolean;
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    }
  ): Promise<T | null> => {
    try {
      // Clear previous errors and start loading
      clearError(key);
      clearValidationErrors(key);
      setLoading(key, true);

      // Execute the API call
      const result = await apiCall();

      // Handle success
      if (options?.successMessage && !options.hideSuccessMessage) {
        showSuccess(options.successMessage);
      }
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      // Handle error
      handleApiError(key, error);
      
      if (options?.onError) {
        options.onError(error);
      }

      return null;
    } finally {
      setLoading(key, false);
    }
  };

  return { executeApiCall };
};

// Utility hook for component error and loading states
export const useComponentState = (componentKey: string) => {
  const { 
    errors, 
    validationErrors, 
    loading,
    clearError,
    clearValidationErrors 
  } = useErrorStore();

  return {
    error: errors[componentKey],
    validationErrors: validationErrors[componentKey] || [],
    loading: loading[componentKey] || false,
    clearError: () => clearError(componentKey),
    clearValidationErrors: () => clearValidationErrors(componentKey),
    hasError: !!errors[componentKey],
    hasValidationErrors: !!(validationErrors[componentKey]?.length),
  };
};