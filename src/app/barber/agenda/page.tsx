'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDailyAgenda } from '@/hooks/useDailyAgenda';
import AgendaGrid from './AgendaGrid';
import styles from './Agenda.module.scss';

// Constrói a chave "YYYY-MM-DD" a partir de campos LOCAIS do Date (não usa toISOString(),
// que converte para UTC e pode deslocar o dia dependendo do fuso do navegador).
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d); // meia-noite local
}

function shiftDateKey(key: string, deltaDays: number): string {
  const dt = parseDateKey(key);
  dt.setDate(dt.getDate() + deltaDays);
  return toDateKey(dt);
}

const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function AgendaPage() {
  const auth = useAuth();
  const [dateKey, setDateKey] = useState<string>(() => toDateKey(new Date()));
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);

  const { barbers, businessHours, holidays, appointments, loading, error } = useDailyAgenda(dateKey);

  // Pré-seleciona o próprio usuário se ele for barbeiro; senão, o primeiro barbeiro da lista.
  useEffect(() => {
    if (selectedBarberId !== null || barbers.length === 0) return;
    if (auth.user?.userType === 'barbeiro') {
      const self = barbers.find((b) => b.id === auth.user!.id);
      setSelectedBarberId(self ? self.id : barbers[0].id);
    } else {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, auth.user, selectedBarberId]);

  const selectedDate = useMemo(() => parseDateKey(dateKey), [dateKey]);
  const dayOfWeek = selectedDate.getDay();
  const businessHoursForDay = businessHours.find((d) => d.dayOfWeek === dayOfWeek) ?? businessHours[dayOfWeek];
  const isHoliday = holidays.some((h) => h.date.slice(0, 10) === dateKey);

  const appointmentsForBarber = useMemo(
    () => appointments.filter((a) => a.admin?.id === selectedBarberId),
    [appointments, selectedBarberId]
  );

  const isToday = dateKey === toDateKey(new Date());

  return (
    <main className={styles.container}>
      <h1>Agenda Diária</h1>

      <div className={styles.toolbar}>
        <div className={styles.dateNav}>
          <button onClick={() => setDateKey((k) => shiftDateKey(k, -1))} aria-label="Dia anterior">
            &lt;
          </button>
          <button onClick={() => setDateKey(toDateKey(new Date()))} disabled={isToday}>
            Hoje
          </button>
          <button onClick={() => setDateKey((k) => shiftDateKey(k, 1))} aria-label="Próximo dia">
            &gt;
          </button>
          <input
            type="date"
            value={dateKey}
            onChange={(e) => e.target.value && setDateKey(e.target.value)}
          />
          <span className={styles.dateLabel}>
            {DAY_LABELS[dayOfWeek]}, {selectedDate.toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className={styles.barberSelect}>
          <label htmlFor="agenda-barber">Barbeiro:</label>
          <select
            id="agenda-barber"
            value={selectedBarberId ?? ''}
            onChange={(e) => setSelectedBarberId(Number(e.target.value))}
          >
            {barbers.length === 0 && <option value="">Nenhum barbeiro cadastrado</option>}
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Carregando agenda...</p>}

      <AgendaGrid
        businessHoursForDay={businessHoursForDay}
        isHoliday={isHoliday}
        appointments={appointmentsForBarber}
      />
    </main>
  );
}
