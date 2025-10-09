'use client';

import React from 'react';
import { Appointment, Service, useBarberData } from '@/hooks/useBarberData';
import styles from './styles.module.scss';
import { FaClock, FaHandScissors, FaInfoCircle } from 'react-icons/fa';

type Props = {
  appointment: Appointment;
  service?: Service;
};

export default function AppointmentCard({ appointment, service }: Props) {
  useBarberData();

  const formatDate = (iso?: string) => {
    if (!iso) return 'Data não definida';
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };
  
  const status = appointment.status?.toUpperCase() || 'CONFIRMED';

  return (
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