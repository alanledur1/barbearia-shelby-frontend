'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './servicos.module.scss';
import { RiScissors2Fill } from 'react-icons/ri';

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

  const servicos = [
    { title: 'SOBRANCELHA', text: 'Design de sobrancelha, com limpeza e modelagem.' },
    { title: 'CORTE E BARBA', text: 'Corte de cabelo e barba com lavagem.' },
    { title: 'MÁQUINA E BARBA', text: 'Corte de cabelo com máquina e barba, com lavagem.' },
    { title: 'CORTE MÁQUINA', text: 'Corte de cabelo na máquina.' },
    { title: 'BARBA', text: 'Modelagem da barba, com lavagem e secagem.' },
    { title: 'CORTE', text: 'Avaliação do cabelo para escolher o melhor corte.' },
    { title: 'BARBA E SOBRANCELHA', text: 'Modelagem da barba e sobrancelha.' },
    { title: 'MÁQUINA + BARBA', text: 'Corte na máquina e barba com lavagem.' },
    { title: 'CORTE E SOBRANCELHA', text: 'Corte de cabelo e sobrancelha com modelagem.' },
  ];

  return (
    <section className={styles.servicos}>
      <div className={styles.grid}>
        {servicos.map((servico, idx) => {
          const isOpen = active === idx;

          return (
            <motion.div
              key={servico.title}
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
                <h3>{servico.title}</h3>
              </div>

              {/* TEXTO SEMPRE EXISTE */}
              <p className={styles.text}>{servico.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
