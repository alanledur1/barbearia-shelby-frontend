'use client';
import React, { useState } from 'react';
import styles from '../../app/EsqueciSenha/EsqueciSenha.module.css';

interface EmailRecuperacaoProps {
  onNext: (email: string) => void;
}

const EmailRecuperacao: React.FC<EmailRecuperacaoProps> = ({ onNext }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(email);
  };

  return (
    <div className={styles.recuperacaoContainer}>
      <form className={`${styles.recuperacaoForm} rounded-card border border-border bg-card`} onSubmit={handleSubmit}>

        <h2 className={`${styles.title}`}>Recuperar Senha</h2>
        <div className={styles.infoText}><p>Insira o seu email e enviaremos um link para você voltar a acessar a sua conta.</p></div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-input"
          />
        </div>
        <button type="submit" className={`${styles.btn} rounded-button`}>Continuar</button>
      </form>
    </div>
  );
};

export default EmailRecuperacao;
