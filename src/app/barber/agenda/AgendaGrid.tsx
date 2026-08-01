'use client';

import React, { useMemo, useState } from 'react';
import { AgendaAppointment, AgendaBusinessHoursDay } from '@/hooks/useDailyAgenda';
import styles from './Agenda.module.scss';

type Props = {
  businessHoursForDay?: AgendaBusinessHoursDay;
  isHoliday: boolean;
  appointments: AgendaAppointment[];
};

const HOUR_HEIGHT_PX = 64;
const PX_PER_MINUTE = HOUR_HEIGHT_PX / 60;
const PADDING_MINUTES = 60; // margem visual antes/depois do expediente

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Minutos desde a meia-noite LOCAL do navegador (mesma convenção já usada em
// AppointmentCard.tsx/toLocaleString('pt-BR') — assume staff acessando do fuso da barbearia).
function localMinutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function formatHourLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  return `${String(h).padStart(2, '0')}:00`;
}

const STATUS_LABEL: Record<AgendaAppointment['status'], string> = {
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default function AgendaGrid({ businessHoursForDay, isHoliday, appointments }: Props) {
  const [selected, setSelected] = useState<AgendaAppointment | null>(null);

  const openTime = businessHoursForDay?.openTime ?? '09:00';
  const closeTime = businessHoursForDay?.closeTime ?? '20:00';
  const isClosedDay = !!businessHoursForDay?.isClosed || isHoliday;

  const { windowStart, windowEnd, openMinutes, closeMinutes } = useMemo(() => {
    const open = parseTimeToMinutes(openTime);
    const close = parseTimeToMinutes(closeTime);
    let start = Math.max(0, open - PADDING_MINUTES);
    let end = Math.min(24 * 60, close + PADDING_MINUTES);

    // Garante que nenhum agendamento fique fora da janela renderizada, mesmo que o expediente
    // tenha sido reconfigurado depois da criação do agendamento (caso de borda).
    appointments.forEach((a) => {
      const apptStart = localMinutesOfDay(a.date);
      const apptEnd = apptStart + a.durationMinutes;
      start = Math.min(start, apptStart);
      end = Math.max(end, apptEnd);
    });

    return { windowStart: start, windowEnd: end, openMinutes: open, closeMinutes: close };
  }, [openTime, closeTime, appointments]);

  const hourMarks = useMemo(() => {
    const marks: number[] = [];
    const firstHour = Math.floor(windowStart / 60) * 60;
    for (let m = firstHour; m <= windowEnd; m += 60) marks.push(m);
    return marks;
  }, [windowStart, windowEnd]);

  const totalHeight = (windowEnd - windowStart) * PX_PER_MINUTE;

  return (
    <div className={styles.gridWrapper}>
      {isClosedDay && (
        <div className={styles.closedBanner}>
          {isHoliday ? 'A barbearia está fechada nesta data (feriado).' : 'Fechado neste dia da semana.'}
        </div>
      )}

      <div className={styles.grid} style={{ height: `${totalHeight}px` }}>
        {/* Sombreamento fora do expediente */}
        {openMinutes > windowStart && (
          <div
            className={styles.blockedZone}
            style={{ top: 0, height: `${(openMinutes - windowStart) * PX_PER_MINUTE}px` }}
          />
        )}
        {closeMinutes < windowEnd && (
          <div
            className={styles.blockedZone}
            style={{
              top: `${(closeMinutes - windowStart) * PX_PER_MINUTE}px`,
              height: `${(windowEnd - closeMinutes) * PX_PER_MINUTE}px`,
            }}
          />
        )}

        {/* Linhas/rótulos de hora */}
        {hourMarks.map((m) => (
          <div
            key={m}
            className={styles.hourRow}
            style={{ top: `${(m - windowStart) * PX_PER_MINUTE}px` }}
          >
            <span className={styles.hourLabel}>{formatHourLabel(m)}</span>
          </div>
        ))}

        {/* Blocos de agendamento */}
        {appointments.map((a) => {
          const apptStart = localMinutesOfDay(a.date);
          const top = (apptStart - windowStart) * PX_PER_MINUTE;
          const height = Math.max(a.durationMinutes * PX_PER_MINUTE, 24);
          const clientName = a.client?.name || a.guestName || 'Cliente convidado';

          return (
            <button
              key={a.id}
              className={`${styles.appointmentBlock} ${styles[`status${a.status}`]}`}
              style={{ top: `${top}px`, height: `${height}px` }}
              onClick={() => setSelected(a)}
            >
              <strong>{clientName}</strong>
              <span>{a.service?.name ?? 'Serviço'}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={styles.detailsPanel}>
          <div className={styles.detailsHeader}>
            <h3>Detalhes do agendamento</h3>
            <button onClick={() => setSelected(null)} aria-label="Fechar">×</button>
          </div>
          <p><strong>Cliente:</strong> {selected.client?.name || selected.guestName || 'Cliente convidado'}</p>
          <p><strong>Contato:</strong> {selected.client?.phone || selected.guestPhone || 'N/A'}</p>
          <p><strong>Serviço:</strong> {selected.service?.name ?? '—'} ({selected.durationMinutes} min)</p>
          <p>
            <strong>Horário:</strong>{' '}
            {new Date(selected.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            {' – '}
            {new Date(selected.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p><strong>Status:</strong> {STATUS_LABEL[selected.status]}</p>
          <p><strong>Notas:</strong> {selected.notes || '—'}</p>
        </div>
      )}

      {!isClosedDay && appointments.length === 0 && (
        <p className={styles.emptyState}>Nenhum agendamento neste dia para o barbeiro selecionado.</p>
      )}
    </div>
  );
}
