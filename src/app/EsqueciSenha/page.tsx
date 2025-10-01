'use client';
import React, { useState } from 'react';
import EmailRecuperacao from '../../components/EsqueciSenha/EmailRecuperacao';
import NovaSenha from '../../components/EsqueciSenha/NovaSenha';

const EsqueciSenhaPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'senha'>('email');
  const [email, setEmail] = useState('');

  const handleEmailNext = (emailDigitado: string) => {
    setEmail(emailDigitado);
    setStep('senha');
  };

  const handleNovaSenha = (email: string, senha: string) => {
    console.log('Enviar para API:', email, senha);
    alert('Senha alterada com sucesso!');
  };

  return (
    <>
      {step === 'email' ? (
        <EmailRecuperacao onNext={handleEmailNext} />
      ) : (
        <NovaSenha email={email} onSubmit={handleNovaSenha} />
      )}
    </>
  );
};

export default EsqueciSenhaPage;
