import { useEffect, useState } from 'react';
import { fetchBarberData, fetchAppointments } from '@/services/api';
import { Barber, Appointment } from '@/types/barber';

export const useBarberDashboard = () => {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const barberData = await fetchBarberData();
        const appointmentsData = await fetchAppointments();
        setBarber(barberData);
        setAppointments(appointmentsData);
      } catch (err) {
        setError('Erro ao buscar dados do barbeiro.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { barber, appointments, loading, error };
};