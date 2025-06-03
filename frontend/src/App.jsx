import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './components/layout/MainLayout';
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import CustomersPage from "./components/CustomersPage";
import OrdersPage from "./components/OrdersPage";
import CampaignList from "./components/CampaignList";
import CampaignForm from "./components/CampaignForm";
import CampaignDetails from "./components/CampaignDetails";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return isLoggedIn ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <CustomersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <PrivateRoute>
                  <CampaignList />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaigns/new"
              element={
                <PrivateRoute>
                  <CampaignForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaigns/:id"
              element={
                <PrivateRoute>
                  <CampaignDetails />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/customers" />} />
            <Route path="*" element={<Navigate to="/customers" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
