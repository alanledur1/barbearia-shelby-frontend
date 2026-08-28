'use client';

import React, { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import ConfirmationModal from '@/app/barber/components/BarberDashboard/ConfirmationModal';
import styles from './MySubscription.module.scss';

export default function MySubscription() {
  const { subscription, availablePlans, loading, error, subscribe, cancelSubscription } = useSubscription();
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [subscribingError, setSubscribingError] = useState<string | null>(null);

  const handleSubscribe = async (planId: number) => {
    setSubscribingError(null);
    try {
      await subscribe(planId);
    } catch (err) {
      setSubscribingError(err instanceof Error ? err.message : 'Erro ao assinar plano.');
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>Meu Plano</h2>
        <p>Carregando...</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Meu Plano</h2>
      {error && <p className={styles.error}>{error}</p>}
      {subscribingError && <p className={styles.error}>{subscribingError}</p>}

      {subscription ? (
        <div className={styles.currentPlan}>
          <h3>{subscription.plan.name}</h3>
          {subscription.plan.description && <p>{subscription.plan.description}</p>}
          {subscription.plan.benefits && <p className={styles.benefits}>{subscription.plan.benefits}</p>}
          <div className={styles.cutsTrack}>
            <div
              className={styles.cutsFill}
              style={{
                transform: `scaleX(${subscription.plan.cutsPerCycle > 0
                  ? subscription.cutsRemaining / subscription.plan.cutsPerCycle
                  : 0
                  })`,
              }}
            />
          </div>
          <p>
            <strong>{subscription.cutsRemaining}</strong> de <strong>{subscription.plan.cutsPerCycle}</strong> cortes
            disponíveis neste ciclo.
          </p>
          <p className={styles.cycleInfo}>
            Ciclo atual reinicia em {new Date(subscription.cycleEnd).toLocaleDateString('pt-BR')}.
          </p>
          <button className={styles.cancelButton} onClick={() => setConfirmingCancel(true)}>
            Cancelar assinatura
          </button>
        </div>
      ) : (
        <div className={styles.availablePlans}>
          {availablePlans.length === 0 ? (
            <p>Nenhum plano disponível no momento.</p>
          ) : (
            availablePlans.map((plan) => (
              <div key={plan.id} className={styles.planCard}>
                <h3>{plan.name}</h3>
                {plan.description && <p>{plan.description}</p>}
                {plan.benefits && <p className={styles.benefits}>{plan.benefits}</p>}
                <p><strong>{plan.cutsPerCycle}</strong> cortes/mês</p>
                <p><strong>R$ {plan.price.toFixed(2).replace('.', ',')}</strong>/mês</p>
                <button className={styles.subscribeButton} onClick={() => handleSubscribe(plan.id)}>
                  Assinar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmingCancel}
        onClose={() => setConfirmingCancel(false)}
        onConfirm={async () => {
          await cancelSubscription();
          setConfirmingCancel(false);
        }}
        title="Cancelar assinatura"
        message={`Tem certeza que deseja cancelar sua assinatura do plano "${subscription?.plan.name}"?`}
      />
    </section>
  );
}
