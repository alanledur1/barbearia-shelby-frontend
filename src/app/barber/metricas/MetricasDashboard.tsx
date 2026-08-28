'use client';

import React from 'react';
import { useBarberMetrics } from '@/hooks/useBarberMetrics';
import styles from './Metricas.module.scss';

export default function MetricasDashboard() {
  const { overall, barbers, loading, error } = useBarberMetrics();

  if (loading && !overall) return <p className={styles.loading}>Carregando métricas...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!overall) return <p>Não foi possível carregar os dados.</p>;

  return (
    <div className={styles.metricsContainer}>
      <h1>Desempenho por Barbeiro</h1>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h2>Faturamento Total</h2>
          <p>R$ {overall.totalRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.metricCard}>
          <h2>Atendimentos Concluídos</h2>
          <p>{overall.totalAppointments}</p>
        </div>
        <div className={styles.metricCard}>
          <h2>Ticket Médio Geral</h2>
          <p>R$ {overall.averageTicket.toFixed(2)}</p>
        </div>
      </div>

      {barbers.length > 0 && (
        <div className={styles.chartCard}>
          {/* O gráfico estava sem título — o painel só mostrava barras soltas, sem dizer
              qual grandeza estavam medindo (o canvas de design nomeia o painel). */}
          <h2 className={styles.chartTitle}>Faturamento por Barbeiro</h2>
          {(() => {
            const maxRevenue = Math.max(...barbers.map((b) => b.totalRevenue), 1);
            return barbers.map((b) => (
              <div className={styles.chartRow} key={b.adminId ?? 'unassigned'}>
                <span>{b.name}</span>
                <div className={styles.chartTrack}>
                  <div
                    className={styles.chartFill}
                    style={{ transform: `scaleX(${b.totalRevenue / maxRevenue})` }}
                  />
                </div>
                <span className={styles.chartValue}>R$ {b.totalRevenue.toFixed(2)}</span>
              </div>
            ));
          })()}
        </div>
      )}

      <div className={styles.breakdownSection}>
        <h2>Performance por Barbeiro</h2>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Barbeiro</th>
                <th>Atendimentos</th>
                <th>Faturamento</th>
                <th>Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((b) => (
                <tr key={b.adminId ?? 'unassigned'}>
                  <td>{b.name}</td>
                  <td>{b.totalAppointments}</td>
                  <td>R$ {b.totalRevenue.toFixed(2)}</td>
                  <td>R$ {b.averageTicket.toFixed(2)}</td>
                </tr>
              ))}
              {barbers.length === 0 && (
                <tr>
                  <td colSpan={4}>Nenhum barbeiro cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
