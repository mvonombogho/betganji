import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole = 'user'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=${router.pathname}`);
      return;
    }

    // Check role-based access if user is authenticated
    if (!isLoading && isAuthenticated && user) {
      const hasRequiredRole = checkUserRole(user, requiredRole);
      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

// Helper function to check if user has required role
const checkUserRole = (user: any, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'user': 1,
    'premium': 2,
    'admin': 3
  };

  const userRoleLevel = roleHierarchy[user.role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  return userRoleLevel >= requiredRoleLevel;
};

export default ProtectedRoute;