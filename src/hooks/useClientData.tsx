'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Tipos (pode reutilizar os do useBarberData se preferir)
export type Appointment = {
  id: number;
  date: string;
  status?: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  serviceId?: number;
  service?: { name: string; duration: number; price: number; };
  notes?: string;
};

export type Service = {
  id: number;
  name: string;
  duration: number;
  price: number;
};

export function useClientData() {
  const auth = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  }, [auth.token]);

  const fetchClientData = useCallback(async () => {
    if (!auth.user || auth.user.userType !== 'cliente') return;

    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      // Busca os agendamentos E todos os serviços em paralelo
      const [appointmentsRes, servicesRes] = await Promise.all([
        api.get(`/appointments?clientId=${auth.user.id}`, { headers }),
        api.get('/services', { headers }) // Para podermos exibir os nomes dos serviços
      ]);

      setAppointments(appointmentsRes.data || []);
      setServices(servicesRes.data || []);

    } catch (err) {
      console.error(err);
      setError('Erro ao carregar seus agendamentos.');
    } finally {
      setLoading(false);
    }
  }, [getHeaders, auth.user]);

  // Função para o cliente cancelar um agendamento
  const cancelAppointment = useCallback(async (id: number) => {
    setError(null);
    try {
      const headers = getHeaders();
      // A rota PATCH que muda o status já existe e pode ser reutilizada!
      await api.patch(`/appointments/${id}`, { status: 'CANCELLED' }, { headers });
      await fetchClientData(); // Recarrega os dados para refletir a mudança
    } catch (err: unknown) { // <-- CORRIGIDO AQUI
      let errorMessage = 'Não foi possível cancelar o agendamento.';
      if (typeof err === 'object' && err !== null) {
        const maybeErr = err as { response?: { data?: { error?: string } }, message?: string };
        errorMessage = maybeErr.response?.data?.error || maybeErr.message || errorMessage;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      console.error("Falha ao cancelar agendamento:", err);
      setError(errorMessage);
      throw err; // Re-lança para que o componente saiba que falhou
    }
  }, [getHeaders, fetchClientData]);


  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  return {
    appointments,
    services,
    loading,
    error,
    refetch: fetchClientData,
    cancelAppointment
  };
}