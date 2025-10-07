// src/app/barber/components/BarberDashboard/AppoitmentsList.tsx
'use client';

import React from 'react';
// MUDANÇA: Importando 'Service' do hook
import { Appointment, Service, useBarberData } from '@/hooks/useBarberData';
import AppointmentCard from './AppointmentCard';
import styles from './styles.module.css';

type Props = {
  appointments: Appointment[];
  services: Service[]; // MUDANÇA: Recebendo a lista de serviços
};

export default function AppointmentsList({ appointments, services }: Props) {
  if (appointments.length === 0) {
    return <div className={styles.empty}>Nenhum agendamento para hoje.</div>;
  }

  return (
    <div className={styles.list}>
      {appointments.map(a => {
        // MUDANÇA: Encontrando o serviço correspondente ao agendamento
        const service = services.find(s => s.id === a.serviceId);
        return (
          <AppointmentCard key={a.id} appointment={a} service={service} />
        );
      })}
    </div>
  );
}