import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

type RawAppointmentData = {
  id: number;
  date: string;
  status?: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  serviceId?: number;
  notes?: string;
  durationMinutes: number;
  // Garanta que 'client' pode ser null ou ter as propriedades esperadas
  client?: {
    id: number;
    name: string;
    email?: string | null; // Permite null também
    phone?: string | null; // Permite null também
  } | null;
  guestName?: string | null; // Permite null
  guestEmail?: string | null; // Permite null
  guestPhone?: string | null; // Permite null
};

export type Appointment = {
  id: number;
  date: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceId?: number;
  status?: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
};

export type BillingSummary = {
  totalRevenue: number;
  totalAppointments: number;
  averageTicket: number;
  servicesBreakdown: { [key: string]: { count: number; revenue: number } };
};

export type Service = { id: number; name: string; duration: number; price: number; description?: string; };

export type UpdateServiceData = { name?: string; duration?: number; price?: number; description?: string };

export function useBarberData() {
  const auth = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined;
  }, [auth?.token]);

  const fetchBillingSummary = useCallback(async () => {
    try {
      const headers = getHeaders();
      const res = await api.get('/billing/summary', { headers });
      setBillingSummary(res.data);
    } catch (err) {
      console.error("Erro ao buscar resumo de faturamento:", err);
      // Não define um erro global para não interferir na outra tela
    }
  }, [getHeaders]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [aRes, sRes, bRes] = await Promise.all([
        api.get<RawAppointmentData[]>('/appointments', { headers }),
        api.get('/services', { headers }),
        api.get('/billing/summary', { headers })
      ]);

      // CORREÇÃO APLICADA AQUI:
      // Acessa as propriedades usando o tipo RawAppointmentData e ?? para fallbacks
      const transformedAppointments: Appointment[] = (aRes?.data || []).map((app: RawAppointmentData) => {
        // Define os valores padrão explicitamente
        let name = 'Cliente Desconhecido';
        let email = 'N/A';
        let phone = 'N/A';

        // Usa os dados do cliente logado se existirem
        if (app.client) {
          name = app.client.name;
          email = app.client.email ?? 'N/A'; // Usa ?? para tratar null/undefined
          phone = app.client.phone ?? 'N/A'; // Usa ?? para tratar null/undefined
        }
        // Se não houver cliente logado, usa os dados do convidado se existirem
        else {
          name = app.guestName ?? name; // Mantém 'Cliente Desconhecido' se guestName for null
          email = app.guestEmail ?? email; // Mantém 'N/A' se guestEmail for null
          phone = app.guestPhone ?? phone; // Mantém 'N/A' se guestPhone for null
        }

        return {
          id: app.id,
          date: app.date,
          status: app.status,
          serviceId: app.serviceId,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          notes: app.notes,
        };
      });

      setAppointments(transformedAppointments);
      setServices(sRes?.data ?? []);
      setBillingSummary(bRes?.data ?? null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [getHeaders]); // Remova fetchBillingSummary se não for usado aqui

  const addService = useCallback(
    async (service: { name: string; duration: number; price: number; description?: string }) => {
      setLoading(true);
      setError(null);
      try {
        // 1. Validações (estão corretas)
        if (!service.name || !service.name.trim()) {
          throw new Error('Nome do serviço é obrigatório.');
        }
        if (service.duration <= 0) {
          throw new Error('Duração inválida.');
        }
        if (service.price < 0) {
          throw new Error('Preço inválido.');
        }

        const headers = getHeaders();

        // 2. PRIMEIRO: Cria o serviço no banco de dados
        await api.post('/services', {
          name: service.name,
          description: service.description ?? '',
          price: service.price,
          duration: service.duration,
        }, { headers });

        // 3. DEPOIS: Recarrega TODOS os dados do servidor.
        //    Isso garante que a lista de serviços esteja 100% atualizada.
        await fetchAll();

      } catch (err: unknown) { // <-- CORRIGIDO AQUI
        let errorMessage = 'Erro ao criar serviço.';
        if (typeof err === 'object' && err !== null) {
          const maybeErr = err as { response?: { data?: { message?: string, error?: string } }, message?: string };
          errorMessage = maybeErr.response?.data?.message || maybeErr.response?.data?.error || maybeErr.message || errorMessage;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        console.error('[addService] erro:', err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getHeaders, fetchAll] // Adicione fetchAll às dependências
  );

  const deleteService = useCallback(
    async (id: number) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.delete(`/services/${id}`, { headers });

        // CORREÇÃO: Chama o fetchAll para recarregar todos os dados do zero
        await fetchAll();

      } catch (err: unknown) { // <-- CORRIGIDO AQUI
        let errorMessage = 'Erro ao excluir serviço.';
        if (typeof err === 'object' && err !== null) {
          const maybeErr = err as { response?: { status?: number, data?: { error?: string } } };
          if (maybeErr.response && maybeErr.response.status === 409) {
            errorMessage = maybeErr.response.data?.error || 'Este serviço não pode ser excluído pois está em uso.';
          } else {
            errorMessage = (maybeErr as Error).message || errorMessage;
          }
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);
        throw err;
      }
    },
    [getHeaders, fetchAll]
  );

  const deleteAppointment = useCallback(
    async (id: number) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.delete(`/appointments/${id}`, { headers });

        // Atualiza lista após exclusao
        await fetchAll();
      } catch (err: unknown) { // <-- CORRIGIDO AQUI
        let errorMessage = 'Erro ao deletar agendamento.';
        if (typeof err === 'object' && err !== null) {
          const maybeErr = err as { response?: { data?: { error?: string } }, message?: string };
          errorMessage = maybeErr.response?.data?.error || maybeErr.message || errorMessage;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        console.error("Erro ao deletar agendamento:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [getHeaders, fetchAll]
  );

  const updateAppointmentStatus = useCallback(
    async (id: number, status: 'COMPLETED' | 'CANCELLED') => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.patch(`/appointments/${id}`, { status }, { headers });

        await fetchAll();

      } catch (err: unknown) { // <-- CORRIGIDO AQUI
        let errorMessage = 'Erro ao atualizar agendamento.';
        if (typeof err === 'object' && err !== null) {
          const maybeErr = err as { response?: { data?: { error?: string } }, message?: string };
          errorMessage = maybeErr.response?.data?.error || maybeErr.message || errorMessage;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        console.error("Falha ao atualizar status:", err);
        setError(errorMessage);
        throw err;
      }
    },
    [getHeaders, fetchAll]
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
    billingSummary,
    refetchBilling: fetchBillingSummary,
    deleteAppointment,
  };
}