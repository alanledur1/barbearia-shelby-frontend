import React from 'react';
import styles from './styles.module.css';

interface AppointmentCardProps {
  appointment: {
    id: string;
    date: string;
    time: string;
    clientName: string;
    service: string;
  };
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <div className={styles.card}>
      <h3>{appointment.clientName}</h3>
      <p>Data: {appointment.date}</p>
      <p>Hora: {appointment.time}</p>
      <p>Serviço: {appointment.service}</p>
    </div>
  );
};

export default AppointmentCard;