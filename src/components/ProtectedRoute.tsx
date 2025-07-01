
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', !!user, 'userProfile:', !!userProfile, 'loading:', loading, 'isAdmin:', isAdmin);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  // Wait for user profile to load, but with a timeout to prevent infinite loading
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Verificar se usuário SACOLEIRA está tentando acessar rotas restritas de produtos
  const restrictedProductRoutes = ['/produtos/novo'];
  const isRestrictedProductRoute = restrictedProductRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (!isAdmin && isRestrictedProductRoute) {
    console.log('SACOLEIRA user trying to access restricted product route');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para criar ou editar produtos.</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    console.log('Admin required but user is not admin');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
