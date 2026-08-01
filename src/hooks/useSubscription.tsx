'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type PlanSummary = {
  id: number;
  name: string;
  description: string | null;
  cutsPerCycle: number;
  price: number;
  benefits: string | null;
  active: boolean;
};

export type MySubscription = {
  id: number;
  status: 'ACTIVE' | 'CANCELLED';
  startDate: string;
  plan: PlanSummary;
  cycleStart: string;
  cycleEnd: string;
  cutsUsed: number;
  cutsRemaining: number;
};

export function useSubscription() {
  const auth = useAuth();
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (!auth.user || auth.user.userType !== 'cliente') {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [subRes, plansRes] = await Promise.all([
        api.get<MySubscription | null>('/subscriptions/me', { headers }),
        api.get<PlanSummary[]>('/plans'),
      ]);
      setSubscription(subRes.data);
      setAvailablePlans(plansRes.data || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar seu plano.'));
    } finally {
      setLoading(false);
    }
  }, [getHeaders, auth.user]);

  const subscribe = useCallback(
    async (planId: number) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.post('/subscriptions', { planId }, { headers });
        await fetchAll();
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao assinar plano.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders, fetchAll]
  );

  const cancelSubscription = useCallback(async () => {
    setError(null);
    try {
      const headers = getHeaders();
      await api.patch('/subscriptions/me/cancel', {}, { headers });
      await fetchAll();
    } catch (err) {
      const message = extractErrorMessage(err, 'Erro ao cancelar assinatura.');
      setError(message);
      throw new Error(message);
    }
  }, [getHeaders, fetchAll]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { subscription, availablePlans, loading, error, refetch: fetchAll, subscribe, cancelSubscription };
}
