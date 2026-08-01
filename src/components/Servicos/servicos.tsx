'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './servicos.module.scss';
import { RiScissors2Fill } from 'react-icons/ri';
import api from '@/services/api';

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
};

function useHasHover() {
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setHasHover(mediaQuery.matches);
  }, []);

  return hasHover;
}

export default function Servicos() {
  const [active, setActive] = useState<number | null>(null);
  const hasHover = useHasHover();

  const [servicos, setServicos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Service[]>('/services');
        setServicos(response.data);
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);
        setError('Não foi possível carregar os serviços. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, []);

  if (loading) {
    return (
      <section className={styles.servicos}>
        <p className={styles.status}>Carregando serviços...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.servicos}>
        <p className={styles.status}>{error}</p>
      </section>
    );
  }

  if (servicos.length === 0) {
    return (
      <section className={styles.servicos}>
        <p className={styles.status}>Nenhum serviço disponível no momento.</p>
      </section>
    );
  }

  return (
    <section className={styles.servicos}>
      <div className={styles.grid}>
        {servicos.map((service, idx) => {
          const isOpen = active === idx;

          return (
            <motion.div
              key={service.id}
              className={`${styles.card} ${isOpen ? styles.active : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => {
                if (!hasHover) {
                  setActive(isOpen ? null : idx);
                }
              }}
            >
              <div className={styles.header}>
                <RiScissors2Fill className={styles.icon} />
                <h3>{service.name}</h3>
              </div>

              <span className={styles.meta}>
                {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                {' · '}
                {service.duration} min
              </span>

              {/* TEXTO SEMPRE EXISTE */}
              <p className={styles.text}>{service.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
