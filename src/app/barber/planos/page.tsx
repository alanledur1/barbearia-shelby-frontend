'use client';

import React, { useState } from 'react';
import { usePlans, Plan } from '@/hooks/usePlans';
import PlanFormModal from './PlanFormModal';
import ConfirmationModal from '../components/BarberDashboard/ConfirmationModal';
import styles from './Planos.module.scss';

export default function PlanosPage() {
  const { plans, loading, error, createPlan, updatePlan, toggleActive } = usePlans();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<Plan | null>(null);

  const handleConfirmToggle = async () => {
    if (!pendingToggle) return;
    await toggleActive(pendingToggle.id, !pendingToggle.active);
    setPendingToggle(null);
  };

  return (
    <main className={styles.container}>
      <h1>Planos</h1>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <div className={styles.toolbar}>
        <div />
        <button className={styles.addButton} onClick={() => setCreating(true)}>Novo Plano</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cortes/ciclo</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.cutsPerCycle}</td>
              <td>R$ {p.price.toFixed(2).replace('.', ',')}</td>
              <td>
                <span className={p.active ? styles.statusActive : styles.statusInactive}>
                  {p.active ? 'Ativo' : 'Desativado'}
                </span>
              </td>
              <td className={styles.actionsCell}>
                <button className={styles.editButton} onClick={() => setEditingPlan(p)}>Editar</button>
                <button
                  className={p.active ? styles.deactivateButton : styles.activateButton}
                  onClick={() => setPendingToggle(p)}
                >
                  {p.active ? 'Desativar' : 'Reativar'}
                </button>
              </td>
            </tr>
          ))}
          {plans.length === 0 && (
            <tr>
              <td colSpan={5}>Nenhum plano cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {(creating || editingPlan) && (
        <PlanFormModal
          plan={editingPlan}
          onClose={() => {
            setCreating(false);
            setEditingPlan(null);
          }}
          onCreate={createPlan}
          onUpdate={updatePlan}
        />
      )}

      <ConfirmationModal
        isOpen={!!pendingToggle}
        onClose={() => setPendingToggle(null)}
        onConfirm={handleConfirmToggle}
        title={pendingToggle?.active ? 'Desativar plano' : 'Reativar plano'}
        message={
          pendingToggle
            ? `Tem certeza que deseja ${pendingToggle.active ? 'desativar' : 'reativar'} o plano "${pendingToggle.name}"?`
            : ''
        }
      />
    </main>
  );
}
