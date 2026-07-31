import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type BusinessHoursDay = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export type Holiday = { id: number; date: string; reason?: string | null };

const DEFAULT_DAYS: BusinessHoursDay[] = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  openTime: '09:00',
  closeTime: '20:00',
  isClosed: false,
}));

export function useBusinessSettings() {
  const auth = useAuth();
  const [businessHours, setBusinessHours] = useState<BusinessHoursDay[]>(DEFAULT_DAYS);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined;
  }, [auth?.token]);

  const extractErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null) {
      const maybeErr = err as { response?: { data?: { error?: string } }; message?: string };
      return maybeErr.response?.data?.error || maybeErr.message || fallback;
    }
    return fallback;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [hoursRes, holidaysRes] = await Promise.all([
        api.get<BusinessHoursDay[]>('/business-hours', { headers }),
        api.get<Holiday[]>('/holidays', { headers }),
      ]);
      // Mescla com DEFAULT_DAYS para garantir 7 linhas mesmo se alguma ainda não existir no banco.
      const byDay = new Map(hoursRes.data.map((d) => [d.dayOfWeek, d]));
      setBusinessHours(DEFAULT_DAYS.map((d) => byDay.get(d.dayOfWeek) ?? d));
      setHolidays(holidaysRes.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar configurações.'));
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const saveBusinessHours = useCallback(
    async (entries: BusinessHoursDay[]) => {
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.put<BusinessHoursDay[]>('/business-hours', entries, { headers });
        setBusinessHours(res.data);
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao salvar horário de funcionamento.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders]
  );

  const addHoliday = useCallback(
    async (date: string, reason?: string) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.post('/holidays', { date, reason }, { headers });
        await fetchAll();
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao cadastrar feriado.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders, fetchAll]
  );

  const removeHoliday = useCallback(
    async (id: number) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.delete(`/holidays/${id}`, { headers });
        setHolidays((prev) => prev.filter((h) => h.id !== id));
      } catch (err) {
        setError(extractErrorMessage(err, 'Erro ao remover feriado.'));
      }
    },
    [getHeaders]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    businessHours,
    holidays,
    loading,
    error,
    setError,
    refetch: fetchAll,
    saveBusinessHours,
    addHoliday,
    removeHoliday,
  };
}
