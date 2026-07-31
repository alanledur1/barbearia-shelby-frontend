'use client';

import React, { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUsers, ManagedUser, ManagedUserRole } from '@/hooks/useUsers';
import UserFormModal from './UserFormModal';
import ConfirmationModal from '../components/BarberDashboard/ConfirmationModal';
import styles from './Usuarios.module.scss';

const ROLE_LABELS: Record<ManagedUserRole, string> = {
  CLIENTE: 'Cliente',
  BARBEIRO: 'Barbeiro',
  DONO: 'Dono',
};

type Filter = 'TODOS' | ManagedUserRole;

export default function UsuariosPage() {
  const auth = useAuth();
  const { users, loading, error, createUser, updateUser, toggleActive } = useUsers();
  const [filter, setFilter] = useState<Filter>('TODOS');
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<ManagedUser | null>(null);

  const filteredUsers = useMemo(() => {
    if (filter === 'TODOS') return users;
    return users.filter((u) => u.role === filter);
  }, [users, filter]);

  const handleConfirmToggle = async () => {
    if (!pendingToggle) return;
    await toggleActive(pendingToggle.id, !pendingToggle.active);
    setPendingToggle(null);
  };

  return (
    <main className={styles.container}>
      <h1>Usuários</h1>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p>Carregando...</p>}

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {(['TODOS', 'CLIENTE', 'BARBEIRO', 'DONO'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterButton} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'TODOS' ? 'Todos' : ROLE_LABELS[f]}
            </button>
          ))}
        </div>
        <button className={styles.addButton} onClick={() => setCreating(true)}>Novo Usuário</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Papel</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const isSelf = auth.user?.id === u.id;
            return (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{ROLE_LABELS[u.role]}</td>
                <td>
                  <span className={u.active ? styles.statusActive : styles.statusInactive}>
                    {u.active ? 'Ativo' : 'Desativado'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  {isSelf ? (
                    <span className={styles.selfLabel}>Você</span>
                  ) : (
                    <>
                      <button className={styles.editButton} onClick={() => setEditingUser(u)}>Editar</button>
                      <button
                        className={u.active ? styles.deactivateButton : styles.activateButton}
                        onClick={() => setPendingToggle(u)}
                      >
                        {u.active ? 'Desativar' : 'Reativar'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={5}>Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {(creating || editingUser) && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setCreating(false);
            setEditingUser(null);
          }}
          onCreate={createUser}
          onUpdate={updateUser}
        />
      )}

      <ConfirmationModal
        isOpen={!!pendingToggle}
        onClose={() => setPendingToggle(null)}
        onConfirm={handleConfirmToggle}
        title={pendingToggle?.active ? 'Desativar usuário' : 'Reativar usuário'}
        message={
          pendingToggle
            ? `Tem certeza que deseja ${pendingToggle.active ? 'desativar' : 'reativar'} ${pendingToggle.name}?`
            : ''
        }
      />
    </main>
  );
}
