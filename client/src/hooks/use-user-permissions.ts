import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-context';
import { apiService } from '@/services/api';

/**
 * Custom hook to fetch and manage user permissions from API
 * Falls back to auth context permissions if API call fails
 */
export function useUserPermissions() {
  const { user } = useAuth();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user?.id || !user?.role) {
        // If no user or role, fallback to auth context permissions
        setUserPermissions(user?.permissions || []);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.getUserPermissions(user.id);
        
        if (response.success && response.data) {
          // API returns role->permissions mapping, extract permissions for user's role
          const rolePermissions = (response.data as Record<string, string[]>)[user.role];
          
          if (rolePermissions && Array.isArray(rolePermissions)) {
            setUserPermissions(rolePermissions);
          } else {
            // Fallback to auth context permissions if role not found in API response
            console.warn(`No permissions found for role: ${user.role}, falling back to auth context`);
            setUserPermissions(user.permissions || []);
          }
        } else {
          // API call failed, fallback to auth context permissions
          console.warn('Failed to fetch permissions from API, falling back to auth context');
          setUserPermissions(user.permissions || []);
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        setError('Failed to fetch permissions');
        // Fallback to auth context permissions on error
        setUserPermissions(user.permissions || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  return {
    userPermissions,
    isLoading,
    error,
    hasPermission: (permission: string) => userPermissions.includes(permission),
  };
}