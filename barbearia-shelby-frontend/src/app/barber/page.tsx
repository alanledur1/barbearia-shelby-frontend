'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import BarberDashboard from './components/BarberDashboard';

export default function DashboardPage() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <p>Você precisa estar logado para acessar a dashboard.</p>;
  }

  return (
    <main>
      <BarberDashboard />
    </main>
  );
}