// Defensive fix for Array.prototype.some to handle null/undefined arrays
import './arrayfix.js';
import { useAuthStore } from './store/auth';
import { useEffect } from 'react';

export function rootContainer(container: any) {
  return container;
}

// App configuration for UmiJS
export function render() {
  // Initialize auth state from localStorage when app starts
  const { user, token, login } = useAuthStore.getState();
  
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null' && !user) {
      try {
        const userData = JSON.parse(storedUser);
        login(storedToken, userData);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
  }
}
