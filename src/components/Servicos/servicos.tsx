'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './servicos.module.scss';
import { RiScissors2Fill } from 'react-icons/ri';

export default function Servicos() {
  const servicos = [
    {
      icon: <RiScissors2Fill />,
      title: 'SOBRANCELHA',
      text: 'Design de sobrancelha, com limpeza e modelagem.',
      delay: 0,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'CORTE E BARBA',
      text: 'Corte de cabelo e barba com lavagem.',
      delay: 0.2,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'MAQUINA E BARBA',
      text: 'Corte de cabelo com máquina e barba, com lavagem.',
      delay: 0.3,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'CORTE MAQUINA',
      text: 'Corte de cabelo na maquina.',
      delay: 0.4,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'BARBA',
      text: 'modelagem da barba, com lavagem e secagem.',
      delay: 0.5,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'CORTE',
      text: 'É feito uma avaliação do cabelo e é escolhido o melhor corte.',
      delay: 0.6,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'BARBA E SOBRANCELHA',
      text: 'Modelagem da barba e sobrancelha, com lavagem e secagem.',
      delay: 0.7,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'CORTE MAQUINA + BARBA',
      text: 'Corte de cabelo na máquina e modelagem da barba, com lavagem.',
      delay: 0.8,
      image: '/images/OIF.webp',
    },
    {
      icon: <RiScissors2Fill />,
      title: 'CORTE E SOBRANCELHA',
      text: 'Corte de cabelo e sobrancelha, com lavagem, secagem e modelagem.',
      delay: 0.9,
      image: '/images/OIF.webp',
    },
  ];

  return (
    <div className={styles.SobreNos}>
      <div className={styles.container}>
        {servicos.map(({ icon, title, text, delay, image }) => (
          <motion.div
            key={title}
            className={styles.flipCard}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay }}
          >
            <div className={styles.flipInner}>
              {/* Frente do card */}
              <div className={styles.flipFront}>
                <div className={styles.icon}>{icon}</div>
                <h3 className={styles.title}>{title}</h3>
              </div>

              {/* Verso do card */}
              <div className={styles.flipBack}>
                <div className={styles.icon}>{icon}</div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.text}>{text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
