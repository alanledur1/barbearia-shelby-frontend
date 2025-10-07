// src/app/barber/components/BarberDashboard/AppointmentCard.tsx
'use client';

import React from 'react';
// MUDANÇA: Importando 'Service'
import { Appointment, Service, useBarberData } from '@/hooks/useBarberData';
import styles from './styles.module.css';
// MUDANÇA: Importando ícones
import { FaUser, FaClock, FaHandScissors, FaInfoCircle } from 'react-icons/fa';

type Props = {
  appointment: Appointment;
  service?: Service; // MUDANÇA: Serviço agora é uma prop
};

export default function AppointmentCard({ appointment, service }: Props) {
  const { setAppointments } = useBarberData();
  // ... (função de updateStatus pode continuar a mesma)

  const formatDate = (iso?: string) => {
    if (!iso) return 'Data não definida';
    const d = new Date(iso);
    // Formato mais completo para a dashboard
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };
  
  const status = appointment.status?.toUpperCase() || 'CONFIRMED';

  return (
    // MUDANÇA: Estrutura do card completamente refeita
    <article className={styles.appointmentCard}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.clientInfo}>{appointment.clientName || 'Cliente Convidado'}</div>
          <small className={styles.clientContact}>{appointment.clientEmail || appointment.clientPhone}</small>
        </div>
        <span className={`${styles.status} ${styles[`status${status}`]}`}>
          {status}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <FaClock />
          <strong>{formatDate(appointment.date)}</strong>
        </div>
        <div className={styles.infoRow}>
          {service ? (
            <>
              <FaHandScissors />
              <span>{service.name} ({service.duration} min) - <strong>R$ {service.price}</strong></span>
            </>
          ) : (
            <>
              <FaInfoCircle /> 
              <span>Serviço não encontrado</span>
            </>
          )}
        </div>
      </div>
      
      {status === 'CONFIRMED' && (
        <div className={styles.cardFooter}>
          <button className={`${styles.actionButton} ${styles.completeButton}`}>
            Concluir
          </button>
          <button className={`${styles.actionButton} ${styles.cancelButton}`}>
            Cancelar
          </button>
        </div>
      )}
    </article>
  );
}