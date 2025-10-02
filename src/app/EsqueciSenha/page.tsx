'use client';
import React, { useState } from 'react';
import EmailRecuperacao from '../../components/EsqueciSenha/EmailRecuperacao';
import OtpVerification from '../../components/EsqueciSenha/OtpVerification'; // renomeei o componente OTP
import NovaSenha from '../../components/EsqueciSenha/NovaSenha';

const EsqueciSenhaPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'codigo' | 'senha'>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');

  // 1️⃣ Primeiro passo: receber email
  const handleEmailNext = (emailDigitado: string) => {
    setEmail(emailDigitado);
    setStep('codigo');
    // Aqui você chamaria sua API para enviar o código OTP para o email
    console.log('Enviar OTP para:', emailDigitado);
  };

  // 2️⃣ Segundo passo: verificar código
  const handleCodigoVerificado = (codigoDigitado: string) => {
    setCodigo(codigoDigitado);
    setStep('senha');
    console.log('Código digitado:', codigoDigitado);
    // Aqui você validaria o código com sua API
  };

  // 3️⃣ Terceiro passo: redefinir senha
  const handleNovaSenha = (email: string, senha: string) => {
    console.log('Enviar para API:', { email, codigo, senha });
    alert('Senha alterada com sucesso!');
  };

  return (
    <>
      {step === 'email' && <EmailRecuperacao onNext={handleEmailNext} />}
      {step === 'codigo' && <OtpVerification onVerify={handleCodigoVerificado} />}
      {step === 'senha' && <NovaSenha email={email} onSubmit={handleNovaSenha} />}
    </>
  );
};

export default EsqueciSenhaPage;
