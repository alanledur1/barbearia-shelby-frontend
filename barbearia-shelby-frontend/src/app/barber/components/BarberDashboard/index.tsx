import React from 'react';
import BarberHeader from './BarberHeader';
import AppointmentsList from './AppointmentsList';
import { useBarberDashboard } from '@/hooks/useBarberDashboard';
import styles from './styles.module.css';

const BarberDashboard = () => {
  const { barberInfo, appointments, loading, error } = useBarberDashboard();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar dados: {error.message}</p>;
  }

  return (
    <div className={styles.dashboard}>
      <BarberHeader barberInfo={barberInfo} />
      <AppointmentsList appointments={appointments} />
    </div>
  );
};

export default BarberDashboard;