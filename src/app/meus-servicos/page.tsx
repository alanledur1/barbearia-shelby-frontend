'use client'; // Mantenha o 'use client' aqui se o componente ClientDashboard precisar

import React from 'react';
// ✅ Importa o componente principal da dashboard do cliente
import ClientDashboard from './components/ClientDashboard'; 

// A página agora simplesmente renderiza o componente da dashboard
export default function MeusAgendamentosPage() {
  return (
    <main> {/* Você pode adicionar estilos a este main se necessário */}
      <ClientDashboard />
    </main>
  );
}