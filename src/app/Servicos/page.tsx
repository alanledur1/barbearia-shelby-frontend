'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Servicos from '@/components/Servicos/servicos';
import styles from './servicos.module.css';

export default function Page() {
  return (
    <div className={styles['servicos-container']}>
      <div className={styles['servicos-header']}>
        <motion.h1
          className={styles['servicos-title']}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Serviços
        </motion.h1>
      </div>
      <Servicos />
    </div>
  );
}
