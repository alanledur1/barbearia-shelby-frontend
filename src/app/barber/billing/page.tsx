'use client';

import React from 'react';
// CORREÇÃO: Apontando para o arquivo de estilo principal da dashboard
import styles from './Billing.module.scss';
import BillingDashboard from './BillingDashboard';

export default function BillingPage() {
  return (
    // Agora, styles.container virá do arquivo correto e vai centralizar a página
    <main className={styles.billingContainer} style={{ margin: '50px auto'}}>
        <BillingDashboard />
    </main>
  );
}