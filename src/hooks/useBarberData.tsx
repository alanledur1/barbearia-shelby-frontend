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

export type Service = { id: number; name: string; duration: number; price: number; description?: string; };

export type UpdateServiceData = { name?: string; duration?: number; price?: number; description?: string };

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
    async (service: { name: string; duration: number; price: number; description?: string }) => {
      setLoading(true);
      setError(null);
      try {
        // validação simples no cliente
        if (!service.name || !service.name.trim()) {
          throw new Error('Nome do serviço é obrigatório.');
        }
        if (service.duration <= 0) {
          throw new Error('Duração inválida.');
        }
        if (service.price < 0) {
          throw new Error('Preço inválido.');
        }

        const headers = {
          ...getHeaders(),
          'Content-Type': 'application/json',
        };

        console.debug('[addService] payload:', service, 'headers:', headers);

        // envia description também (conforme backend)
        const res = await api.post('/services', {
          name: service.name,
          description: service.description ?? '',
          price: service.price,
          duration: service.duration,
        }, { headers });

        if (res?.data) {
          setServices(prev => [...prev, res.data]);
          return res.data;
        }

        return null;
      } catch (err) {
        const axiosResp = err?.response?.data;
        const backendMsg = axiosResp?.message || axiosResp || err.message;
        console.error('[addService] erro:', err, 'backend:', axiosResp);
        setError(String(backendMsg ?? 'Erro ao criar serviço.'));
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
        // 1. Verifica se o erro veio da API (Axios) e se o status é 409 (Conflito)
        if (err.response && err.response.status === 409) {
          // 2. Se for, usa a mensagem específica que o backend enviou
          setError(err.response.data.error || 'Este serviço não pode ser excluído pois está em uso.');
        } else {
          // 3. Para qualquer outro tipo de erro, mostra a mensagem genérica
          setError('Erro ao excluir serviço. Tente novamente mais tarde.');
        }
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

  const updateService = useCallback(
    async (id: number, data: UpdateServiceData) => {
      setLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        // Usamos api.put para a rota de atualizacao
        const res = await api.put(`/services/${id}`, data, { headers });

        // Atualiza a lista de servicos no estado local para refletir a mudanca instantaneamente
        if (res?.data) {
          setServices(prev => prev.map(s => (s.id === id ? res.data : s)));
        }
        return res?.data;
      } catch (err) {
        console.error(err);
        setError('Erro ao atualizar o serviço.');
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
    updateService,
    setError,
  };
}