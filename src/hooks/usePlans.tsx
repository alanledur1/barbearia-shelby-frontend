import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type Plan = {
  id: number;
  name: string;
  description: string | null;
  cutsPerCycle: number;
  price: number;
  benefits: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreatePlanPayload = {
  name: string;
  description?: string;
  cutsPerCycle: number;
  price: number;
  benefits?: string;
};

export type UpdatePlanPayload = Partial<{
  name: string;
  description: string;
  cutsPerCycle: number;
  price: number;
  benefits: string;
  active: boolean;
}>;

export function usePlans() {
  const auth = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
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
      const res = await api.get<Plan[]>('/plans/all', { headers });
      setPlans(res.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar planos.'));
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const createPlan = useCallback(
    async (payload: CreatePlanPayload) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.post('/plans', payload, { headers });
        await fetchAll();
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao criar plano.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders, fetchAll]
  );

  const updatePlan = useCallback(
    async (id: number, payload: UpdatePlanPayload) => {
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.put<Plan>(`/plans/${id}`, payload, { headers });
        setPlans((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao atualizar plano.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders]
  );

  const toggleActive = useCallback(
    async (id: number, active: boolean) => {
      await updatePlan(id, { active });
    },
    [updatePlan]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { plans, loading, error, setError, refetch: fetchAll, createPlan, updatePlan, toggleActive };
}
