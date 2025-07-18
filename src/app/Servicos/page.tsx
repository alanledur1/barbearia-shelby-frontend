// src/app/Servicos/page.tsx
'use client';

import React, { useState } from 'react';

import Servicos from '@/components/Servicos/servicos';
import styles from './servicos.module.css';

export default function Page() {
  return (
    <div className={styles['servicos-container']}>
      <Servicos />
    </div>
  );
}
