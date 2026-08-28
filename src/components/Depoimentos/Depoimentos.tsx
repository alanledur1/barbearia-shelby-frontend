'use client';

import { motion } from 'framer-motion';
import styles from './depoimentos.module.scss';
import { SectionGlow } from '@/components/SectionGlow/SectionGlow';

// Depoimentos ilustrativos — não temos ainda um modelo de avaliações reais no backend.
// Mantidos como conteúdo estático marcado (ver .sampleNote), igual validado no canvas de
// design; trocar por dados reais assim que existir uma fonte (ex: Google Reviews, ou um
// model de avaliação no Prisma).
const DEPOIMENTOS = [
  {
    quote: '"Melhor corte da região. Ambiente show e hora marcada de verdade — chego, sento e saio pronto."',
    author: '— Marcos S.',
  },
  {
    quote: '"Degradê impecável e o combo corte+barba vale cada centavo. Já é rotina mensal."',
    author: '— Rafael T.',
  },
  {
    quote: '"Sem enrolação mesmo — agendei pelo WhatsApp e fui atendido no horário certinho."',
    author: '— Lucas M.',
  },
];

function Stars() {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
        </svg>
      ))}
    </div>
  );
}

export default function Depoimentos() {
  return (
    <section className={styles.depoimentos}>
      <SectionGlow position="topRight" intensity={10} />
      <motion.div
        className={`${styles.head} animate-title`}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <span className="section-kicker">Quem já passou por aqui</span>
        <h2 className="section-title">
          Confiança <span className="accent">Registrada</span>
        </h2>
        <span className="section-rule" />
        <p className={styles.headSubtitle}>Avaliações de quem já sentou na cadeira.</p>
      </motion.div>

      <div className={styles.grid}>
        {DEPOIMENTOS.map(({ quote, author }, idx) => (
          <motion.div
            key={author}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: idx * 0.1 }}
          >
            <Stars />
            <p className={styles.quote}>{quote}</p>
            <span className={styles.author}>{author}</span>
          </motion.div>
        ))}
      </div>

      <p className={styles.ratingLine}>
        <strong>4.9</strong> de 5 · +200 avaliações
      </p>
      <p className={styles.sampleNote}>
        * Depoimentos ilustrativos — em produção, avaliações reais de clientes.
      </p>
    </section>
  );
}
