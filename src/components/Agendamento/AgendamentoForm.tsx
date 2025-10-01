'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import styles from './Agendamento.module.scss';
import { bookingSchema, type BookingFormData, formatName } from '@/schemas/agendamentoSchema';

type Props = {
  onBookingSubmitAction: (data: BookingFormData) => void;
  isLoading: boolean;
  initialValues?: BookingFormData; // prefill quando usuário está logado
};

export default function AgendamentoForm({ onBookingSubmitAction, isLoading, initialValues }: Props) {
  const [formData, setFormData] = useState<BookingFormData>(
    initialValues ?? { cliente: '', email: '', phone: '' }
  );

  // Atualiza o formulário quando os valores iniciais mudam (por exemplo, após carregar auth)
  React.useEffect(() => {
    if (initialValues) setFormData(initialValues);
  }, [initialValues]);

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    
    // Se o campo for o telefone, permite apenas numeros
    if (id === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [id]: numericValue }));
    } else {
      // Para os outros campos, o comportamento é normal
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleNameBluer = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value) {
      const formattedName = formatName(value);
      setFormData(prev => ({ ...prev, cliente: formattedName }));
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    // 3. Validar os dados antes de enviar
    const result = bookingSchema.safeParse(formData);

    if (!result.success) {
      // Se a validação falhar, atualiza o estado de erros
      setErrors(result.error.issues);
    } else {
      // Se a validação passar, limpa os erros e envia os dados
      setErrors([]);
      onBookingSubmitAction(result.data);
    }
  };

  // Função auxiliar para encontrar o erro de um campo específico
  const getError = (path: string) => errors.find(e => e.path[0] === path)?.message;

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.inputGroup}>
        <label htmlFor="cliente">Seu Nome</label>
        <input
          type="text"
          id="cliente"
          value={formData.cliente}
          onChange={handleChange}
          onBlur={handleNameBluer}
          placeholder="Digite seu nome completo"
          required
          disabled={isLoading}
          className={getError('cliente') ? styles.error : ''}
        />
        {getError('cliente') && <p className={styles.errorMessage}>{getError('cliente')}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Seu Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="exemplo@email.com"
          required
          disabled={isLoading}
          className={getError('email') ? styles.error : ''}
        />
        {getError('email') && <p className={styles.errorMessage}>{getError('email')}</p>}
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="phone">Seu Telefone</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(51) 99999-9999"
          required
          disabled={isLoading}
          className={getError('phone') ? styles.error : ''}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {getError('phone') && <p className={styles.errorMessage}>{getError('phone')}</p>}
      </div>

      <button type="submit" className={styles.primaryButton} disabled={isLoading}>
        {isLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
      </button>
    </form>
  );
}