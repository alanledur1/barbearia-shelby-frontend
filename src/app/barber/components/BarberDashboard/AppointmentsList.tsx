// src/app/barber/components/BarberDashboard/AppoitmentsList.tsx
'use client';

import React from 'react';
// MUDANÇA: Importando 'Service' do hook
import { Appointment, Service } from '@/hooks/useBarberData';
import AppointmentCard from './AppointmentCard';
import styles from './styles.module.scss';

type Props = {
  appointments?: Appointment[] | null;
  services?: Service[] | null; // agora opcional
};

export default function AppointmentsList({ appointments = [], services = [] }: Props) {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return <div className={styles.empty}>Nenhum agendamento para hoje.</div>;
  }

  // garante que services é array ao usar find
  const svcList = Array.isArray(services) ? services : [];

  return (
    <div className={styles.list}>
      {appointments.map(a => {
        const service = svcList.find(s => s.id === a.serviceId) ?? undefined;
        return (
          <AppointmentCard key={a.id} appointment={a} service={service} />
        );
      })}
    </div>
  );
}