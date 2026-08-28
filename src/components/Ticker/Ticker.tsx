'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import styles from './ticker.module.scss';

type Service = { id: number; name: string };

const ScissorsDot = () => (
  <svg
    className={styles.dot}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

// Faixa decorativa com os nomes reais dos serviços (mesma fonte que Serviços) — puramente
// atmosférica, por isso não trata erro/loading: se a lista ainda não chegou, o componente
// simplesmente não renderiza nada.
export default function Ticker() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api
      .get<Service[]>('/services')
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  if (services.length === 0) return null;

  // Lista duplicada pra criar o loop contínuo (translateX(-50%) precisa do dobro do conteúdo).
  const items = [...services, ...services];

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {items.map((s, i) => (
          <span key={`${s.id}-${i}`}>
            {s.name} <ScissorsDot />
          </span>
        ))}
      </div>
    </div>
  );
}
