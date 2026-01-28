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
      >
        <h1 className={styles['servicos-title']}>Serviços</h1>
      </motion.div>

      <Servicos />
    </div>
  );
}
