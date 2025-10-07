'use client';

import React from 'react';
import styles from './styles.module.css';

type Props = {
  onRefresh: () => void;
  appointmentsCount: number;
  servicesCount: number;
};

export default function BarberHeader({ onRefresh, appointmentsCount, servicesCount }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <h1>Dashboard do Barbeiro</h1>
        <p>{appointmentsCount} agendamento(s) • {servicesCount} serviço(s)</p>
      </div>
      <div>
        <button className={styles.button} onClick={onRefresh}>Recarregar</button>
      </div>
    </header>
  );
}