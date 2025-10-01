'use client';

import React, { useState } from 'react';
import CriarConta from '../../components/CriarConta/CriarConta';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

const CriarContaPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (name: string, email: string, phone: string, password: string) => {
    setError('');
    console.log("Enviando:", { name, email, phone, password });
    try {
      await api.post('/clients/signup', {
        name,
        email,
        phone,
        password,
      });

  // Mostrar mensagem de sucesso antes de ir para login
  setSuccessMessage('Conta criada com sucesso! Redirecionando para login...');
  setTimeout(() => router.push('/Login'), 1500);
    } catch (err: unknown) {
      setError("Não foi possível criar a conta. Tente novamente.");
      console.error(err);
    }
  };


  return <>
    <CriarConta onRegister={handleRegister} apiError={error} />
    {successMessage && (
      <div style={{ position: 'fixed', top: 90, right: 20, background: '#d4edda', color: '#155724', padding: '12px 18px', borderRadius: 8, zIndex: 1200 }}>
        {successMessage}
      </div>
    )}
  </>;
};

export default CriarContaPage;
