import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type BarberMetric = {
  adminId: number | null;
  name: string;
  role: string | null;
  totalRevenue: number;
  totalAppointments: number;
  averageTicket: number;
};

export type MetricsOverall = {
  totalRevenue: number;
  totalAppointments: number;
  averageTicket: number;
};

export function useBarberMetrics() {
  const auth = useAuth();
  const [overall, setOverall] = useState<MetricsOverall | null>(null);
  const [barbers, setBarbers] = useState<BarberMetric[]>([]);
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
      const res = await api.get<{ overall: MetricsOverall; barbers: BarberMetric[] }>(
        '/billing/summary/by-barber',
        { headers }
      );
      setOverall(res.data.overall);
      setBarbers(res.data.barbers);
    } catch (err: unknown) {
      let errorMessage = 'Erro ao carregar métricas por barbeiro.';
      if (typeof err === 'object' && err !== null) {
        const maybeErr = err as { response?: { data?: { error?: string } }; message?: string };
        errorMessage = maybeErr.response?.data?.error || maybeErr.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { overall, barbers, loading, error, refetch: fetchAll };
}
