import React from 'react';
import { motion } from 'framer-motion';
import styles from './servicos.module.scss';
import { image } from 'framer-motion/client';



export default function Servicos() {
  return (
    <div className={styles.SobreNos}>
      <motion.div
        layout
        className={styles.title}
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        SERVIÇOS
      </motion.div>

      <div className={styles.container}>
        {[
          {
            title: 'Corte de Cabelo',
            text: 'Corte de cabelo, lavado com shampoo, secagem e modelagem com pomada ou cera. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0,
            image: '/images/corte.webp'
          },
          {
            title: 'Corte + Barba',
            text: 'Corte de cabelo e barba, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.2,
            image: '/images/barba.jpeg'
          },
          {
            title: 'Corte + Barba + Sobrancelha',
            text: 'Corte de cabelo, barba e sobrancelha, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.4,
            image: '/images/sobrancelha.jpg'
          },
          {
            title: 'Corte + Sobrancelha',
            text: 'Corte de cabelo e sobrancelha, com lavagem, secagem e modelagem. O corte é feito com tesoura, navalha ou máquina, dependendo do estilo desejado.',
            delay: 0.6,
            image: '/images/corte-2.jpg'
          },
        ].map(({ title, text, delay, image }) => (
          <motion.div
            layout
            className={styles.card}
            key={title}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay }}
          >
            <div className={styles.imageWrapper}>
              <img src={image} className={styles.image} />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.text}>{text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
