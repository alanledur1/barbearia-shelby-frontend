'use client';

import React, { useEffect, useState } from 'react';
import { useBusinessSettings, BusinessHoursDay } from '@/hooks/useBusinessSettings';
import styles from './Configuracoes.module.scss';

const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function ConfiguracoesPage() {
  const { businessHours, holidays, loading, error, saveBusinessHours, addHoliday, removeHoliday } = useBusinessSettings();
  const [draft, setDraft] = useState<BusinessHoursDay[]>(businessHours);
  const [saving, setSaving] = useState(false);
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  // Sincroniza o rascunho local quando os dados carregam/mudam do servidor.
  useEffect(() => {
    setDraft(businessHours);
  }, [businessHours]);

  const updateDraftDay = (dayOfWeek: number, patch: Partial<BusinessHoursDay>) => {
    setDraft((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));
  };

  const handleSaveHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBusinessHours(draft);
    } catch {
      // erro já fica exposto via `error` do hook
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate) return;
    try {
      await addHoliday(holidayDate, holidayReason || undefined);
      setHolidayDate('');
      setHolidayReason('');
    } catch {
      // erro já fica exposto via `error` do hook
    }
  };

  return (
    <main className={styles.container}>
      <h1>Configurações</h1>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <section className={styles.section}>
        <h2>Horário de Funcionamento</h2>
        <form onSubmit={handleSaveHours}>
          {draft.map((day) => (
            <div key={day.dayOfWeek} className={styles.dayRow}>
              <span className={styles.dayLabel}>{DAY_LABELS[day.dayOfWeek]}</span>
              <label>
                <input
                  type="checkbox"
                  checked={day.isClosed}
                  onChange={(e) => updateDraftDay(day.dayOfWeek, { isClosed: e.target.checked })}
                />
                Fechado
              </label>
              <input
                type="time"
                value={day.openTime}
                disabled={day.isClosed}
                onChange={(e) => updateDraftDay(day.dayOfWeek, { openTime: e.target.value })}
              />
              <span>até</span>
              <input
                type="time"
                value={day.closeTime}
                disabled={day.isClosed}
                onChange={(e) => updateDraftDay(day.dayOfWeek, { closeTime: e.target.value })}
              />
            </div>
          ))}
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Horário'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2>Feriados / Bloqueios</h2>
        <form onSubmit={handleAddHoliday} className={styles.holidayForm}>
          <input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} required />
          <input
            type="text"
            placeholder="Motivo (opcional)"
            value={holidayReason}
            onChange={(e) => setHolidayReason(e.target.value)}
          />
          <button type="submit" className={styles.addButton}>Adicionar</button>
        </form>
        <ul className={styles.holidayList}>
          {holidays.map((h) => (
            <li key={h.id}>
              <span>
                {new Date(h.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                {h.reason && ` — ${h.reason}`}
              </span>
              <button onClick={() => removeHoliday(h.id)} className={styles.deleteButton}>Remover</button>
            </li>
          ))}
          {holidays.length === 0 && <li>Nenhum feriado cadastrado.</li>}
        </ul>
      </section>
    </main>
  );
}
