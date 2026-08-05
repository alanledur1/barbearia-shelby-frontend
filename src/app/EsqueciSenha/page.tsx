'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmailRecuperacao from '../../components/EsqueciSenha/EmailRecuperacao';
import OtpVerification from '../../components/EsqueciSenha/OtpVerification'; // renomeei o componente OTP
import NovaSenha from '../../components/EsqueciSenha/NovaSenha';
import api from '@/services/api';

const EsqueciSenhaPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'codigo' | 'senha'>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1️⃣ Primeiro passo: solicitar o envio do código OTP para o email informado
  const handleEmailNext = async (emailDigitado: string) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: emailDigitado });
      setEmail(emailDigitado);
      setStep('codigo');
    } catch (err: unknown) {
      setError('Não foi possível enviar o email agora. Tente novamente em instantes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reenvio do código (mesmo endpoint do passo 1, reaproveitando o email já informado)
  const handleResendCode = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setError('');
    } catch (err: unknown) {
      setError('Não foi possível reenviar o código agora. Tente novamente em instantes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Segundo passo: verificar o código digitado
  const handleCodigoVerificado = async (codigoDigitado: string) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-reset-otp', { email, code: codigoDigitado });
      setCodigo(codigoDigitado);
      setStep('senha');
    } catch (err: unknown) {
      setError('Código inválido ou expirado. Tente novamente ou reenvie o código.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Terceiro passo: redefinir a senha usando o código já verificado
  const handleNovaSenha = async (emailConfirmado: string, senha: string) => {
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email: emailConfirmado, code: codigo, newPassword: senha });
      setSuccessMessage('Senha alterada com sucesso! Redirecionando para login...');
      setTimeout(() => router.push('/Login'), 1500);
    } catch (err: unknown) {
      setError('Não foi possível alterar a senha. Verifique o código e tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 'email' && <EmailRecuperacao onNext={handleEmailNext} />}
      {step === 'codigo' && (
        <OtpVerification
          email={email}
          onVerify={handleCodigoVerificado}
          onResend={handleResendCode}
          apiError={error || undefined}
        />
      )}
      {step === 'senha' && (
        <NovaSenha email={email} onSubmit={handleNovaSenha} apiError={error || undefined} />
      )}
      {loading && (
        <div style={{ position: 'fixed', top: 90, right: 20, background: '#2a2a2a', color: '#f0f0f0', padding: '12px 18px', borderRadius: 8, zIndex: 1200 }}>
          Processando...
        </div>
      )}
      {successMessage && (
        <div style={{ position: 'fixed', top: 90, right: 20, background: '#d4edda', color: '#155724', padding: '12px 18px', borderRadius: 8, zIndex: 1200 }}>
          {successMessage}
        </div>
      )}
    </>
  );
};

export default EsqueciSenhaPage;
