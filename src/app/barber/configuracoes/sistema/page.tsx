'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSystemSettings, AuditModule, JobConfigData } from '@/hooks/useSystemSettings';
import styles from './Sistema.module.scss';

const MODULE_LABELS: Record<AuditModule, string> = {
  USERS: 'Usuários',
  BUSINESS_HOURS: 'Horário de Funcionamento',
  HOLIDAYS: 'Feriados',
  PLANS: 'Planos',
};
const ALL_MODULES: AuditModule[] = ['USERS', 'BUSINESS_HOURS', 'HOLIDAYS', 'PLANS'];

const JOB_LABELS: Record<string, string> = {
  appointmentReminder: 'Lembrete de agendamento (email)',
  auditLogCleanup: 'Limpeza do log de auditoria',
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('pt-BR');
}

function JobRow({
  job,
  onSave,
}: {
  job: JobConfigData;
  onSave: (data: { enabled: boolean; cronExpression: string }) => Promise<void>;
}) {
  const [enabled, setEnabled] = useState(job.enabled);
  const [cronExpression, setCronExpression] = useState(job.cronExpression);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEnabled(job.enabled);
    setCronExpression(job.cronExpression);
  }, [job.enabled, job.cronExpression]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ enabled, cronExpression });
    } catch {
      // erro exposto via `error` do hook (renderizado no componente pai)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.jobRow}>
      <span className={styles.jobLabel}>{JOB_LABELS[job.jobKey] ?? job.jobKey}</span>
      <label>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        Habilitado
      </label>
      <input
        type="text"
        value={cronExpression}
        onChange={(e) => setCronExpression(e.target.value)}
        placeholder="0 9 * * *"
        aria-label={`Expressão cron para ${JOB_LABELS[job.jobKey] ?? job.jobKey}`}
      />
      <span className={styles.lastRun}>Última execução: {formatDateTime(job.lastRunAt)}</span>
      <button type="button" className={styles.saveButton} disabled={saving} onClick={handleSave}>
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
}

export default function ConfiguracoesSistemaPage() {
  const { auditSettings, auditLog, jobs, loading, error, saveAuditSettings, saveJob } = useSystemSettings();
  const [retentionDays, setRetentionDays] = useState(auditSettings.retentionDays);
  const [enabledModules, setEnabledModules] = useState<AuditModule[]>(auditSettings.enabledModules);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRetentionDays(auditSettings.retentionDays);
    setEnabledModules(auditSettings.enabledModules);
  }, [auditSettings]);

  const toggleModule = (moduleKey: AuditModule) => {
    setEnabledModules((prev) =>
      prev.includes(moduleKey) ? prev.filter((m) => m !== moduleKey) : [...prev, moduleKey]
    );
  };

  const handleSaveAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAuditSettings({ retentionDays, enabledModules });
    } catch {
      // erro já exposto via `error` do hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.container}>
      <Link href="/barber/configuracoes" className={styles.backLink}>
        ← Voltar para Configurações
      </Link>
      <h1>Configurações de Sistema</h1>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <section className={styles.section}>
        <h2>Auditoria</h2>
        <form onSubmit={handleSaveAudit}>
          <label className={styles.retentionLabel}>
            Retenção (dias)
            <input
              type="number"
              min={1}
              max={3650}
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
            />
          </label>
          <div className={styles.moduleList}>
            {ALL_MODULES.map((moduleKey) => (
              <label key={moduleKey}>
                <input
                  type="checkbox"
                  checked={enabledModules.includes(moduleKey)}
                  onChange={() => toggleModule(moduleKey)}
                />
                {MODULE_LABELS[moduleKey]}
              </label>
            ))}
          </div>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Auditoria'}
          </button>
        </form>

        <h3 className={styles.subheading}>Últimas ações registradas</h3>
        <ul className={styles.logList}>
          {auditLog.map((entry) => (
            <li key={entry.id}>
              <span className={styles.logDate}>{formatDateTime(entry.createdAt)}</span>
              <span>
                {entry.actorName} ({entry.actorRole})
              </span>
              <span>{entry.action}</span>
              <span>
                {entry.entity}
                {entry.entityId ? ` #${entry.entityId}` : ''}
              </span>
            </li>
          ))}
          {auditLog.length === 0 && <li>Nenhuma entrada registrada ainda.</li>}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Filas / Jobs</h2>
        {jobs.map((job) => (
          <JobRow key={job.jobKey} job={job} onSave={(data) => saveJob(job.jobKey, data)} />
        ))}
        {jobs.length === 0 && !loading && <p>Nenhum job configurado.</p>}
      </section>
    </main>
  );
}
