'use client';
import React, { useState } from 'react';
import styles from '../../app/EsqueciSenha/EsqueciSenha.module.css';

interface OtpProps {
  onVerify: (code: string) => void;
}

const OtpVerification: React.FC<OtpProps> = ({ onVerify }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp.join(""));
  };

  return (
    <div className={styles.recuperacaoContainer}>
      <form className={styles.recuperacaoForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Verificação de Código</h2>
        <div className={styles.infoText}>
          <p>Digite o código de 6 dígitos enviado para seu email.</p>
        </div>

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
              className={styles.otpInput}
            />
          ))}
        </div>
        <div className={styles.infoTextB}>
          <p>Não recebeu o codigo ?</p><a href="">Reenviar</a>
        </div>
        <button type="submit" className={styles.btn}>Confirmar</button>
      </form>
    </div>
  );
};

export default OtpVerification;
