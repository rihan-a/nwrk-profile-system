import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ProtectedRoute } from './shared/components/ProtectedRoute';
import { Layout } from './shared/components/Layout';
import { LoginForm } from './features/auth/LoginForm';
import { Dashboard } from './features/profile/Dashboard';
import { ProfileView } from './features/profile/components/ProfileView';
import { ProfileDashboard } from './features/profile/components/ProfileDashboard';
import { ProfileEditModal } from './features/profile/components/ProfileEditModal';
import { UserRole, EmployeeProfile } from './shared/types/index';
import { ProfileBrowser } from './features/profile/components/ProfileBrowser';

import { FeedbackList } from './features/feedback/components/FeedbackList';
import { AbsencePage, ManagerAbsencePage, TeamManagementPage } from './features/absence';
import { ToastProvider } from './shared/components/ui/ToastProvider';
import { MessageSquare } from 'lucide-react';
import { localStorageService } from './shared/services/localStorage';

// Feedback wrapper component
const Feedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchReceivedFeedback();
    }
  }, [user]);

  const fetchReceivedFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, try to load from localStorage for immediate response
      if (localStorageService.isAvailable()) {
        const localFeedback = localStorageService.getFeedbackReceivedByUser(user!.id);
        setFeedback(localFeedback);

      }
      
      // Then try to fetch from API for latest data
      try {
        const response = await fetch('/api/feedback/received', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const apiFeedback = data.data || [];
          
          // Update localStorage with fresh data
          if (localStorageService.isAvailable()) {
            const allFeedback = localStorageService.loadFeedback();
            const otherFeedback = allFeedback.filter(f => f.toUserId !== user!.id);
            const updatedFeedback = [...apiFeedback, ...otherFeedback];
            localStorageService.saveFeedback(updatedFeedback);

          }
          
          setFeedback(apiFeedback);

        } else {

        }
      } catch (apiError) {

        // Continue using localStorage data
      }
    } catch (err) {
      console.error('❌ Error in fetchReceivedFeedback:', err);
      setError('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }

  // Show received feedback for the current user
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Feedback Received</h2>
        <p className="text-gray-300 mt-1">
          {user.role === 'manager' 
            ? 'View all feedback across the organization'
            : 'View feedback and recognition from your colleagues'
          }
        </p>
      </div>

      {/* Feedback List */}
      <FeedbackList
        feedback={feedback}
        loading={loading}
        error={error}
        currentUser={{
          id: user.id,
          role: user.role
        }}
        onDelete={async () => Promise.resolve()} // No delete functionality for received feedback
        showEnhanced={true}
      />

      {/* Empty State - Only show if no feedback and not loading */}
      {!loading && !error && feedback.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Feedback Yet</h3>
          <p className="text-gray-300">
            {user.role === 'manager' 
              ? 'No feedback has been shared across the organization yet.'
              : 'When your colleagues leave feedback for you, it will appear here.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Placeholder components for other routes (to be implemented in later phases)
const Settings = () => <div className="text-center py-12"><h1 className="text-2xl font-bold text-white">Settings - Phase 2</h1></div>;

// Wrapper components for profile management
const ProfileViewWrapper = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<EmployeeProfile | null>(null);
  
  const handleEditProfile = (id: string) => {
    // Fetch the profile and open edit modal
    fetch(`/api/profiles/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setEditingProfile(data.profile);
      setEditModalOpen(true);
    })
    .catch(error => console.error('Failed to fetch profile for editing:', error));
  };

  const handleSaveProfile = async (updatedData: Partial<EmployeeProfile>) => {
    if (!editingProfile) return;
    
    try {
      const response = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  return (
    <>
      <ProfileView onEditProfile={handleEditProfile} />
      <ProfileEditModal
        profile={editingProfile}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
};

const ProfileDashboardWrapper = () => {
  const navigate = useNavigate();
  
  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };
  
  const handleEditProfile = (id: string) => {
    // Navigate to profile view for editing
    navigate(`/profile/${id}`);
  };

  return (
    <ProfileDashboard 
      onViewProfile={handleViewProfile}
      onEditProfile={handleEditProfile}
    />
  );
};

const ProfileBrowserWrapper = () => {
  const navigate = useNavigate();
  
  const handleViewProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };
  
  const handleLeaveFeedback = (id: string) => {
    // Navigate to the profile view where feedback can be left
    navigate(`/profile/${id}?tab=feedback`);
  };
  
  return (
    <ProfileBrowser 
      onViewProfile={handleViewProfile}
      onLeaveFeedback={handleLeaveFeedback}
    />
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-400"></div>
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
              <ProfileViewWrapper />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profiles" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <Layout>
              <ProfileDashboardWrapper />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profiles/browse" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.COWORKER, UserRole.EMPLOYEE]}>
            <Layout>
              <ProfileBrowserWrapper />
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
          <ProtectedRoute allowedRoles={[UserRole.EMPLOYEE, UserRole.COWORKER]}>
            <Layout>
              <AbsencePage />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/manager/absence" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <Layout>
              <ManagerAbsencePage />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/manager/team" 
        element={
          <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
            <Layout>
              <TeamManagementPage />
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
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
