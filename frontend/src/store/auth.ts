import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      // Custom hydration to read tokens from localStorage on page load
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined' && state) {
          const token = localStorage.getItem('access_token');
          const userStr = localStorage.getItem('user');
          
          if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
            try {
              const user = JSON.parse(userStr);
              state.token = token;
              state.user = user;
              state.isAuthenticated = true;
            } catch (error) {
              console.error('Failed to parse user from localStorage:', error);
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              localStorage.removeItem('refresh_token');
            }
          }
        }
      },
    }
  )
);
