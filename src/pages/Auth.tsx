
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';

export default function Auth() {
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <AuthTabs />
    </AuthLayout>
  );
}
