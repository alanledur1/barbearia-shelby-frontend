import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export type AuditModule = 'USERS' | 'BUSINESS_HOURS' | 'HOLIDAYS' | 'PLANS';
export type AuditSettingsData = { retentionDays: number; enabledModules: AuditModule[] };
export type AuditLogEntry = {
  id: number;
  actorId: number;
  actorName: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: string | null;
  createdAt: string;
};
export type JobConfigData = {
  id: number;
  jobKey: string;
  enabled: boolean;
  cronExpression: string;
  lastRunAt: string | null;
  updatedAt: string;
};

export function useSystemSettings() {
  const auth = useAuth();
  const [auditSettings, setAuditSettings] = useState<AuditSettingsData>({ retentionDays: 90, enabledModules: [] });
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [jobs, setJobs] = useState<JobConfigData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => (auth?.token ? { Authorization: `Bearer ${auth.token}` } : undefined), [auth?.token]);

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
      const [settingsRes, logRes, jobsRes] = await Promise.all([
        api.get<AuditSettingsData>('/admin-settings/audit', { headers }),
        api.get<AuditLogEntry[]>('/admin-settings/audit-log', { headers }),
        api.get<JobConfigData[]>('/admin-settings/jobs', { headers }),
      ]);
      setAuditSettings(settingsRes.data);
      setAuditLog(logRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao carregar configurações do sistema.'));
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const saveAuditSettings = useCallback(
    async (data: AuditSettingsData) => {
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.put<AuditSettingsData>('/admin-settings/audit', data, { headers });
        setAuditSettings(res.data);
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao salvar parâmetros de auditoria.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders]
  );

  const saveJob = useCallback(
    async (jobKey: string, data: { enabled: boolean; cronExpression: string }) => {
      setError(null);
      try {
        const headers = getHeaders();
        const res = await api.put<JobConfigData>(`/admin-settings/jobs/${jobKey}`, data, { headers });
        setJobs((prev) => prev.map((j) => (j.jobKey === jobKey ? res.data : j)));
      } catch (err) {
        const message = extractErrorMessage(err, 'Erro ao salvar configuração do job.');
        setError(message);
        throw new Error(message);
      }
    },
    [getHeaders]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { auditSettings, auditLog, jobs, loading, error, refetch: fetchAll, saveAuditSettings, saveJob };
}
