'use client';

import React, { useEffect } from 'react';
import { useBarberData } from '@/hooks/useBarberData';
import styles from './Billing.module.scss';


export default function BillingDashboard() {
    const { billingSummary, loading, refetchBilling } = useBarberData();

    useEffect(() => {
        refetchBilling();
    }, [refetchBilling]);

    if (loading && !billingSummary) return <p className={styles.loading}>Carregando métricas...</p>;
    if (!billingSummary) return <p>Não foi possível carregar os dados.</p>;

    return (
        <div className={styles.billingContainer}>
            <h1>Resumo de Faturamento</h1>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <h2>Faturamento Total</h2>
                    <p>R$ {billingSummary.totalRevenue.toFixed(2)}</p>
                </div>
                <div className={styles.metricCard}>
                    <h2>Serviços Concluídos</h2>
                    <p>{billingSummary.totalAppointments}</p>
                </div>
                <div className={styles.metricCard}>
                    <h2>Ticket Médio</h2>
                    <p>R$ {billingSummary.averageTicket.toFixed(2)}</p>
                </div>
            </div>
            <div className={styles.breakdownSection}>
                <h2>Performance por Serviço</h2>
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th>Serviço</th>
                                <th>Quantidade</th>
                                <th>Receita Gerada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(billingSummary.servicesBreakdown).map(([name, data]) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{data.count}</td>
                                    <td>R$ {data.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
