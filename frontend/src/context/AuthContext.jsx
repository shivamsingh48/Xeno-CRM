import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const AuthContext = createContext();

// Create axios instance with default config
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const { data } = await api.get('/auth/getUser');
      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { fullName, email, password });
      if (data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const { data } = await api.get(`/auth/google?code=${authResult['code']}`);
        if (data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error with Google authentication:", error);
      throw error;
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google login error:", error);
    },
    flow: 'auth-code'
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, register, logout, handleGoogleLogin, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
