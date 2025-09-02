import { useState, useCallback, useEffect } from 'react';
import { Feedback, UserRole } from '../../../shared/types';
import { localStorageService } from '../../../shared/services/localStorage';

// Use relative URLs to match the rest of the application
const API_BASE_URL = '';

interface UseFeedbackReturn {
  feedback: Feedback[];
  loading: boolean;
  error: string | null;
  createFeedback: (profileId: string, feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteFeedback: (feedbackId: string) => Promise<void>;
  refreshFeedback: (profileId: string, currentUser: { id: string; role: UserRole }) => Promise<void>;
}

export const useFeedback = (): UseFeedbackReturn => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load feedback from localStorage on mount
  useEffect(() => {
    if (localStorageService.isAvailable()) {
      // Check for and clear any stale feedback data first
      localStorageService.clearStaleFeedback();
      
      const storedFeedback = localStorageService.loadFeedback();
      setFeedback(storedFeedback);
      console.log('📂 Initial feedback loaded from localStorage:', storedFeedback.length, 'items');
    }
  }, []);

  const refreshFeedback = useCallback(async (profileId: string, currentUser: { id: string; role: UserRole }) => {
    try {
      console.log('🔄 Refreshing feedback for profile:', profileId, 'user:', currentUser);
      setLoading(true);
      setError(null);
      
      // First, try to load from localStorage for immediate response
      if (localStorageService.isAvailable()) {
        const localFeedback = localStorageService.getFeedbackForProfile(profileId);
        setFeedback(localFeedback);
        console.log('📂 Loaded from localStorage for profile', profileId + ':', localFeedback.length, 'items');
      }
      
      // Then try to fetch from API for latest data
      try {
        const url = `${API_BASE_URL}/api/feedback/profiles/${profileId}`;
        console.log('📡 Fetching from URL:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        console.log('📡 Refresh response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Refresh API response:', result);
          const apiFeedback = result.data || [];
          
          // Update localStorage with fresh data
          if (localStorageService.isAvailable()) {
            const allFeedback = localStorageService.loadFeedback();
            const otherFeedback = allFeedback.filter(f => f.toUserId !== profileId);
            const updatedFeedback = [...apiFeedback, ...otherFeedback];
            localStorageService.saveFeedback(updatedFeedback);
            console.log('💾 Updated localStorage with fresh data');
          }
          
          setFeedback(apiFeedback);
          console.log('🔄 Feedback list updated from API:', apiFeedback);
        } else {
          console.warn('⚠️ API fetch failed, using localStorage data');
        }
      } catch (apiError) {
        console.warn('⚠️ API fetch failed, using localStorage data:', apiError);
        // Continue using localStorage data
      }
    } catch (err) {
      console.error('❌ Error in refreshFeedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = useCallback(async (profileId: string, feedbackData: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Optimistic update
    const optimisticFeedback: Feedback = {
      ...feedbackData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      console.log('🚀 Creating feedback for profile:', profileId, feedbackData);
      setError(null);
      
      console.log('📝 Adding optimistic feedback:', optimisticFeedback);
      setFeedback(prev => [optimisticFeedback, ...prev]);

      // Save to localStorage immediately for offline support
      if (localStorageService.isAvailable()) {
        localStorageService.addFeedback(optimisticFeedback);
        console.log('💾 Optimistic feedback saved to localStorage');
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/feedback/profiles/${profileId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });

        console.log('📡 API response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ API success response:', result);
          
          // Replace optimistic feedback with real one
          const realFeedback = result.data as Feedback;
          if (realFeedback) {
            setFeedback(prev => prev.map(f => 
              f.id === optimisticFeedback.id ? realFeedback : f
            ));
          }
          
          // Update localStorage with real feedback
          if (localStorageService.isAvailable()) {
            localStorageService.updateFeedback(realFeedback);
            console.log('💾 Real feedback saved to localStorage');
          }
          
          console.log('🔄 Feedback list updated with real feedback');
        } else {
          const errorText = await response.text();
          console.error('❌ API error response:', errorText);
          throw new Error('Failed to create feedback');
        }
      } catch (apiError) {
        console.warn('⚠️ API call failed, keeping optimistic feedback in localStorage:', apiError);
        // Keep the optimistic feedback in localStorage for offline support
        // The user will see their feedback immediately, and it will sync when online
      }
    } catch (err) {
      console.error('❌ Error in createFeedback:', err);
      // Remove optimistic feedback on error
      setFeedback(prev => prev.filter(f => !f.id.startsWith('temp-')));
      if (localStorageService.isAvailable()) {
        localStorageService.removeFeedback(optimisticFeedback.id);
      }
      setError(err instanceof Error ? err.message : 'Failed to create feedback');
    }
  }, []);

  const deleteFeedback = useCallback(async (feedbackId: string) => {
    try {
      setError(null);
      
      // Optimistic update
      setFeedback(prev => prev.filter(f => f.id !== feedbackId));
      
      // Remove from localStorage immediately
      if (localStorageService.isAvailable()) {
        localStorageService.removeFeedback(feedbackId);
        console.log('🗑️ Feedback removed from localStorage:', feedbackId);
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete feedback');
        }
        
        console.log('✅ Feedback deleted from API:', feedbackId);
      } catch (apiError) {
        console.warn('⚠️ API delete failed, but feedback removed from localStorage:', apiError);
        // Keep the optimistic update since we removed from localStorage
      }
    } catch (err) {
      console.error('❌ Error in deleteFeedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete feedback');
    }
  }, []);

  return {
    feedback,
    loading,
    error,
    createFeedback,
    deleteFeedback,
    refreshFeedback,
  };
};
