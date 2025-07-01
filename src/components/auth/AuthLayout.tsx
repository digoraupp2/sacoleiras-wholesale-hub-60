
import React from 'react';
import { Package } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Atacado Pro</h1>
          </div>
          <p className="text-gray-600">Sistema de Gestão de Sacoleiras</p>
        </div>
        {children}
      </div>
    </div>
  );
}
