import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import React from 'react';

export default function UsuariosLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserType={['dono']}>
      {children}
    </ProtectedRoute>
  );
}
