'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Servicos from '@/components/Servicos/servicos';
import styles from './servicos.module.css';

export default function Page() {
  return (
    <div className={styles['servicos-container']}>

      <motion.div
        className={styles['servicos-header']}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <h1 className={styles['servicos-title']}>Serviços</h1>
      </motion.div>

      <Servicos />
    </div>
  );
}
