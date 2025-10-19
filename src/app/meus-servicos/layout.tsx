import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserType="client">
      {children}
    </ProtectedRoute>
  );
}