'use client';

import React from 'react';
import CriarConta from '../../components/CriarConta/CriarConta';

const CriarContaPage: React.FC = () => {
  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Novo usuário:', { name, email, password });
    // aqui você integraria com API (ex: POST /api/register)
  };

  return <CriarConta onRegister={handleRegister} />;
};

export default CriarContaPage;
