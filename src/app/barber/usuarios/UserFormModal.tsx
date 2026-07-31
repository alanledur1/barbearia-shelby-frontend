'use client';

import React, { useState } from 'react';
import styles from './Usuarios.module.scss';
import { ManagedUser, ManagedUserRole, CreateUserPayload, UpdateUserPayload } from '@/hooks/useUsers';

type Props = {
  user?: ManagedUser | null;
  onClose: () => void;
  onCreate: (data: CreateUserPayload) => Promise<void>;
  onUpdate: (id: number, data: UpdateUserPayload) => Promise<void>;
};

const ROLE_OPTIONS: ManagedUserRole[] = ['CLIENTE', 'BARBEIRO', 'DONO'];

export default function UserFormModal({ user, onClose, onCreate, onUpdate }: Props) {
  const isEditing = !!user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ManagedUserRole>(user?.role ?? 'CLIENTE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isEditing && password.length < 8) {
      setFormError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (isEditing && password && password.length < 8) {
      setFormError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && user) {
        const payload: UpdateUserPayload = { name, email, phone, role };
        if (password) payload.password = password;
        await onUpdate(user.id, payload);
      } else {
        await onCreate({ name, email, phone: phone || undefined, password, role });
      }
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        {formError && <p className={styles.formError}>{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefone</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">{isEditing ? 'Nova senha (opcional)' : 'Senha'}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required={!isEditing}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">Papel</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as ManagedUserRole)}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
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
