'use client';

import React, { useState } from 'react';
import styles from './Planos.module.scss';
import { Plan, CreatePlanPayload, UpdatePlanPayload } from '@/hooks/usePlans';

type Props = {
  plan?: Plan | null;
  onClose: () => void;
  onCreate: (data: CreatePlanPayload) => Promise<void>;
  onUpdate: (id: number, data: UpdatePlanPayload) => Promise<void>;
};

export default function PlanFormModal({ plan, onClose, onCreate, onUpdate }: Props) {
  const isEditing = !!plan;
  const [name, setName] = useState(plan?.name ?? '');
  const [description, setDescription] = useState(plan?.description ?? '');
  const [cutsPerCycle, setCutsPerCycle] = useState(plan?.cutsPerCycle?.toString() ?? '');
  const [price, setPrice] = useState(plan?.price?.toString() ?? '');
  const [benefits, setBenefits] = useState(plan?.benefits ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cuts = parseInt(cutsPerCycle, 10);
    const priceValue = parseFloat(price);

    if (!name.trim()) {
      setFormError('Nome é obrigatório.');
      return;
    }
    if (isNaN(cuts) || cuts <= 0) {
      setFormError('Cortes por ciclo deve ser um número inteiro maior que zero.');
      return;
    }
    if (isNaN(priceValue) || priceValue < 0) {
      setFormError('Preço inválido.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && plan) {
        await onUpdate(plan.id, {
          name,
          description: description || undefined,
          cutsPerCycle: cuts,
          price: priceValue,
          benefits: benefits || undefined,
        });
      } else {
        await onCreate({
          name,
          description: description || undefined,
          cutsPerCycle: cuts,
          price: priceValue,
          benefits: benefits || undefined,
        });
      }
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar plano.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Editar Plano' : 'Novo Plano'}</h2>
        {formError && <p className={styles.formError}>{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descrição (opcional)</label>
            <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="cutsPerCycle">Cortes por ciclo (mensal)</label>
            <input
              id="cutsPerCycle"
              type="number"
              min={1}
              step={1}
              value={cutsPerCycle}
              onChange={(e) => setCutsPerCycle(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="price">Preço (R$)</label>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="benefits">Benefícios (opcional)</label>
            <textarea id="benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={3} />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
