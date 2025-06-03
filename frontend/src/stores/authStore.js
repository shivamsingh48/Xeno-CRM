import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/getUser`);
      
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Authentication failed',
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
    }
  },

  logout: async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Logout failed'
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/getUser`);

      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Session expired',
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
    }
  }
}));

export default useAuthStore; 