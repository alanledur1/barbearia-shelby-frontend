'use client';

import React, { useMemo } from 'react';
import { Appointment, Service } from '@/hooks/useClientData';
import styles from './ClientAppointmentCard.module.scss';

type Props = {
  appointment: Appointment;
  service?: Service;
  onCancel: (id: number) => Promise<void>;
};

export default function ClientAppointmentCard({ appointment, service, onCancel }: Props) {
  const formatDate = (iso?: string) => {
    if (!iso) return 'Data não definida';
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  const status = appointment.status?.toUpperCase() || 'CONFIRMADO';
  
  const canCancel = useMemo(() => {
    if (status !== 'CONFIRMED') return false;

    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDifference >= 2;
  }, [appointment.date, status]);

  return (
    <article className={styles.appointmentCard}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.serviceName}>{service?.name || 'Serviço'}</div>
          <small className={styles.serviceDetails}>
            {formatDate(appointment.date)}
          </small>
        </div>
        <span className={`${styles.status} ${styles[`status${status}`]}`}>
          {status}
        </span>
      </div>

      <div className={styles.cardBody}>
        <p><strong>Duração:</strong> {service?.duration || 'N/A'} min</p>
        <p><strong>Preço:</strong> R$ {service?.price.toFixed(2) || 'N/A'}</p>
        {appointment.notes && <p><strong>Obs:</strong> {appointment.notes}</p>}
      </div>

      {status === 'CONFIRMED' && (
        <div className={styles.cardFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={() => onCancel(appointment.id)}
            disabled={!canCancel}
            title={canCancel ? "Cancelar o agendamento" : "Cancelamento não permitido com menos de 2h de antecedência"}
          >
            Cancelar Agendamento
          </button>
        </div>
      )}
    </article>
  );
}