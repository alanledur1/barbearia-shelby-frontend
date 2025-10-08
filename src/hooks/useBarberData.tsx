import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type Appointment = {
  id: number;
  date: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceId?: number;
  status?: 'pending' | 'completed' | 'cancelled';
};

export type Service = { id: number; name: string; duration: number; price: number; };

export function useBarberData() {
  const auth = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined;
  }, [auth?.token]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [aRes, sRes] = await Promise.all([
        api.get('/appointments', { headers }),
        api.get('/services', { headers }),
      ]);
      setAppointments(aRes?.data ?? []);
      setServices(sRes?.data ?? []);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const addService = useCallback(
    async (service: { name: string; duration: number; price: number }) => {
      setLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.post('/services', service, { headers });
        if (res?.data) setServices(prev => [...prev, res.data]);
        return res?.data;
      } catch (err) {
        console.error(err);
        setError('Erro ao criar serviço.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getHeaders]
  );

  const deleteService = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        await api.delete(`/services/${id}`, { headers });
        setServices(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error(err);
        setError('Erro ao excluir serviço.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getHeaders]
  );

  const updateAppointmentStatus = useCallback(
    async (id: number, status: Appointment['status']) => {
      setLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.patch(`/appointments/${id}`, { status }, { headers });
        const newStatus = res?.data?.status ?? status;
        setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status: newStatus } : a)));
        return res?.data;
      } catch (err) {
        console.error(err);
        setError('Erro ao atualizar agendamento.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getHeaders]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    appointments,
    services,
    loading,
    error,
    refetch: fetchAll,
    setAppointments,
    addService,
    deleteService,
    updateAppointmentStatus,
  };
}