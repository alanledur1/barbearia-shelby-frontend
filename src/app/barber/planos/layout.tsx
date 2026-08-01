import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import React from 'react';

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserType={['dono', 'admin']}>
      {children}
    </ProtectedRoute>
  );
}
