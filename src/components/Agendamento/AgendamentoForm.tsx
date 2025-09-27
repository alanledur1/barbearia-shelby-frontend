'use client';

import React, { useState } from 'react';
import styles from './Agendamento.module.scss';

type Props = {
  onBookingSubmit: (data: { cliente: string; email: string; phone: string }) => void;
};

export default function AgendamentoForm({ onBookingSubmit }: Props) {
  const [cliente, setCliente] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!cliente || !email || !phone) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onBookingSubmit({ cliente, email, phone});
    setCliente('');
    setEmail('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="cliente">Seu Nome:</label>
        <input
          type="text"
          id="cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="Digite seu nome completo"
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Seu Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemplo@email.com"
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="phone">Seu Telefone:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(51) 99999-9999"
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Confirmar Agendamento
      </button>
    </form>
  );
}