// src/app/barber/page.tsx
'use client';

import React from 'react';
import BarberDashboard from './components/BarberDashboard/BarberDashboard';

export default function DashboardPage() {
  // A verificação de login foi removida daqui, pois o layout.tsx já protege a rota.
  return (
    <main>
      <BarberDashboard />
    </main>
  );
}