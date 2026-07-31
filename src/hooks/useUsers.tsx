import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type ManagedUserRole = 'CLIENTE' | 'BARBEIRO' | 'DONO';

export type ManagedUser = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: ManagedUserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: ManagedUserRole;
};

export type UpdateUserPayload = Partial<{
  name: string;
  email: string;
  phone: string;
  password: string;
  role: ManagedUserRole;
  active: boolean;
}>;

export function useUsers() {
  const auth = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
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
      const res = await api.get<ManagedUser[]>('/users', { headers });
      setUsers(res.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar usuários.'));
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const createUser = useCallback(
    async (payload: CreateUserPayload) => {
      setError(null);
      try {
        const headers = getHeaders();
        await api.post('/users', payload, { headers });
        await fetchAll();
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao criar usuário.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders, fetchAll]
  );

  const updateUser = useCallback(
    async (id: number, payload: UpdateUserPayload) => {
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.put<ManagedUser>(`/users/${id}`, payload, { headers });
        setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao atualizar usuário.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders]
  );

  const toggleActive = useCallback(
    async (id: number, active: boolean) => {
      await updateUser(id, { active });
    },
    [updateUser]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { users, loading, error, setError, refetch: fetchAll, createUser, updateUser, toggleActive };
}
