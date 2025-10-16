'use client';

import React from 'react'
import styles from './/EditServiceModal.module.scss';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
};

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message } : Props) {
    if (!isOpen) {
        return null;
    }

  return (
    <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>{title}</h2>
            <p style={{ textAlign: 'center', margin: '1.5rem 0', lineHeight: 1.6}}>
                {message}
            </p>
            <div className={styles.actions}>
                <button onClick={onClose} className={styles.cancelButton}>
                    Voltar
                </button>
                <button onClick={onConfirm} className={styles.saveButton}>
                    Confirmar
                </button>
            </div>
        </div>
    </div>
  );
}
