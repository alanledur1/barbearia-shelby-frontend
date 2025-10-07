// src/app/barber/components/BarberDashboard/BarberDashboard.tsx
'use client';

import React from 'react';
import { useBarberData } from '@/hooks/useBarberData';
import BarberHeader from './BarberHeader';
import AppointmentsList from './AppoitmentsList'; // A typo no nome do arquivo existe, mantendo por consistência
import styles from './styles.module.css';

export default function BarberDashboard() {
  const { appointments, services, loading, error, refetch } = useBarberData();

  return (
    <section className={styles.container}>
      <BarberHeader onRefresh={refetch} appointmentsCount={appointments.length} servicesCount={services.length} />
      {loading && <div className={styles.message}>Carregando dados...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <div className={styles.content}>
          {/* MUDANÇA: Passando 'services' para a lista de agendamentos */}
          <AppointmentsList appointments={appointments} services={services} />
          <aside className={styles.sidebar}>
            <h3>Serviços</h3>
            {services.length === 0 ? <p>Nenhum serviço cadastrado.</p> : (
              <ul className={styles.serviceList}>
                {services.map(s => (
                  <li key={s.id} className={styles.serviceItem}>
                    <strong>{s.name}</strong> — {s.duration}min — R$ {s.price}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </section>
  );
}