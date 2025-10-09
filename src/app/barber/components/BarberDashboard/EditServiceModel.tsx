'use Client';

import { Service } from '@/hooks/useBarberData';
import React, { useState } from 'react';
import styles from './EditServiceModal.module.scss';

type Props = {
    service: Service;
    onClose: () => void;
    onSubmit: (id: number, data: { name: string; duration: number; price: number; }) => Promise<void>;
};

export default function EditServiceModel({ service, onClose, onSubmit }: Props) {
    const [name, setName] = useState(service.name);
    const [duration, setDuration] = useState(service.duration);
    const [price, setPrice] = useState(service.price);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(service.id, {name, duration, price });
            onClose();
        } catch (error) {
            console.error('Falha ao Salvar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Editar Serviço</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor='name'>Nome</label>
                        <input id='name' value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    {/* Campo de duração adicionado */}
                    <div className={styles.inputGroup}>
                        <label htmlFor='duration'>Duração (min)</label>
                        <input id='duration' type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor='price'>Preço (R$)</label>
                        <input id='price' type="number" step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                    </div>
                    <div className={styles.actions}>
                        <button type='button' className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                        <button type='submit' className={styles.saveButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
