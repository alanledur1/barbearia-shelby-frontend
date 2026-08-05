import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import React from 'react';

export default function ConfiguracoesSistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserType={['admin']}>
      {children}
    </ProtectedRoute>
  );
}
