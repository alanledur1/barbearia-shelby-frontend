'use client';
import React, { useState } from 'react';
import styles from '../../app/EsqueciSenha/EsqueciSenha.module.css';

interface NovaSenhaProps {
  email: string;
  onSubmit: (email: string, senha: string) => void;
}

const NovaSenha: React.FC<NovaSenhaProps> = ({ email, onSubmit }) => {
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmar) {
      setError('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setError('');
    onSubmit(email, senha);
  };

  return (
    <div className={styles.recuperacaoContainer}>
      <form className={styles.recuperacaoForm} onSubmit={handleSubmit}>
        <h2 className={styles.titleN}>Definir Nova Senha</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password"
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.btn}>Alterar Senha</button>
      </form>
    </div>
  );
};

export default NovaSenha;
