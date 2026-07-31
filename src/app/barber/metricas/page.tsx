'use client';

import React from 'react';
import styles from './Metricas.module.scss';
import MetricasDashboard from './MetricasDashboard';

export default function MetricasPage() {
  return (
    <main className={styles.metricsPageContainer}>
      <MetricasDashboard />
    </main>
  );
}
