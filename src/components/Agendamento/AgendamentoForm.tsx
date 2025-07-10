// src/components/Agendamento/AgendamentoForm.tsx
'use client';

import React, { useState } from 'react';
import styles from './Agendamento.module.scss'; // 1. Importe o arquivo SCSS

type Props = {
  onBookingSubmit: (data: { cliente: string }) => void;
};

export default function AgendamentoForm({ onBookingSubmit }: Props) {
  const [cliente, setCliente] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!cliente) {
      alert('Por favor, informe seu nome.');
      return;
    }
    onBookingSubmit({ cliente });
    setCliente('');
  };

  return (
    // 2. Aplique a classe principal do formulário
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* 3. Aplique a classe para o grupo de input */}
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
      {/* 4. Aplique a classe para o botão */}
      <button type="submit" className={styles.submitButton}>
        Confirmar Agendamento
      </button>
    </form>
  );
}