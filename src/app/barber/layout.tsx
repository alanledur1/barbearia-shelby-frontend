import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import React from 'react';
import Sidebar from './components/BarberDashboard/Sidebar';
import styles from './BarberLayout.module.scss';

export default function BarberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserType={['barbeiro', 'dono', 'admin']}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </ProtectedRoute>
  );
}