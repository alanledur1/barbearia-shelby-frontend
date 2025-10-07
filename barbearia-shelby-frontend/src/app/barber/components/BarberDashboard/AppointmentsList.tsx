import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '@/services/api';
import AppointmentCard from './AppointmentCard';
import styles from './styles.module.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Erro ao buscar agendamentos.');
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, []);

  if (loading) {
    return <p>Carregando agendamentos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.appointmentsList}>
      {appointments.length === 0 ? (
        <p>Não há agendamentos disponíveis.</p>
      ) : (
        appointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      )}
    </div>
  );
};

export default AppointmentsList;