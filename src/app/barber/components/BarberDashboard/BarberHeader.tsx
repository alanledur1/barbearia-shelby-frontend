'use client';

import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { Appointment } from '@/hooks/useBarberData';

type Props = {
  onRefresh: () => void;
  appointmentsCount: number;
  servicesCount: number;
  allAppointments: Appointment[];
  onFilterToggle: () => void;
  currentFilter: 'future' | 'overdue' | 'history'; 
};

export default function BarberHeader({ onRefresh, appointmentsCount, servicesCount, allAppointments, onFilterToggle, currentFilter }: Props) {
  const overdueCount = useMemo(() => {
    const now = new Date();
    return allAppointments.filter(
      a => a.status === 'CONFIRMED' && new Date(a.date) < now
    ).length;
  }, [allAppointments]);

  return (
    <header className={styles.header}>
      <div>
        <h1>
          Dashboard do Barbeiro
          {overdueCount > 0 && (
            <button 
              className={`${styles.overdueBadge} ${currentFilter === 'overdue' ? styles.active : ''}`} 
              title={`Atenção: ${overdueCount} agendamento(s) passado(s) pendente(s). Clique para ver.`}
              onClick={onFilterToggle}
            >
              {overdueCount}
            </button>
          )}
        </h1>
        <p>{appointmentsCount} agendamento(s) futuros • {servicesCount} serviço(s)</p>
      </div>
      <div>
        <Link href="/barber/billing">
          <button className={styles.refreshButton} style={{ marginRight: '1rem' }}>Faturamento</button>
        </Link>
        <button className={styles.refreshButton} onClick={onRefresh}>Recarregar</button>
      </div>
    </header>
  );
}