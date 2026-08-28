'use client';
import React, { useState } from 'react';
import styles from '../../app/EsqueciSenha/EsqueciSenha.module.css';

interface OtpProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  apiError?: string;
}

const OtpVerification: React.FC<OtpProps> = ({ email, onVerify, onResend, onBack, apiError }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Foco automático para o próximo input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  // Backspace num campo vazio volta o foco pro dígito anterior — o avanço pra frente já
  // existia, faltava só o caminho de volta (achado real na validação no canvas de design).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp.join(""));
  };

  return (
    <div className={styles.recuperacaoContainer}>
      <form className={`${styles.recuperacaoForm} rounded-card border border-border bg-card`} onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={onBack}
          className="block mb-4 text-sm text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer p-0"
        >
          ← Voltar
        </button>
        <h2 className={`${styles.title}`}>Verificação de Código</h2>
        <div className={styles.infoText}>
          <p>Digite o código de 6 dígitos enviado para {email}.</p>
        </div>

        {apiError && <p className={styles.error} aria-live="polite">{apiError}</p>}

        <div className={styles.otpGroup}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={styles.otpInput}
            />
          ))}
        </div>
        <div className={styles.infoTextB}>
          <p>Não recebeu o código?</p>
          <a
            href="#"
            className="font-bold uppercase tracking-[0.12em] text-primary hover:underline"
            onClick={(e) => { e.preventDefault(); onResend(); }}
          >
            Reenviar
          </a>
        </div>
        <button type="submit" className={`${styles.btn} rounded-button`}>Confirmar</button>
      </form>
    </div>
  );
};

export default OtpVerification;
