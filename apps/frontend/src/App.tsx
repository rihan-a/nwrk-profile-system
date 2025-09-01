import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { Layout } from './shared/components/Layout';
import { LoginForm } from './features/auth/LoginForm';
import { Dashboard } from './features/profile/Dashboard';
import { UserRole } from './shared/types/index';

// Placeholder components for other routes (to be implemented in later phases)
const ProfileView = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Profile View - Phase 2</h1></div>;
const ProfilesList = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Profiles List - Phase 2</h1></div>;
const Feedback = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Feedback System - Phase 3</h1></div>;
const Absence = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Absence Management - Phase 4</h1></div>;
const Settings = () => <div className="text-center py-12"><h1 className="text-2xl font-bold">Settings - Phase 2</h1></div>;

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileView />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profiles" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <Layout>
              <ProfilesList />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/feedback" 
        element={
          <ProtectedRoute>
            <Layout>
              <Feedback />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/absence" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER, UserRole.EMPLOYEE]}>
            <Layout>
              <Absence />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/settings" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Default redirects */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      <Route 
        path="*" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
