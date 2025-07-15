'use client';

import { motion } from 'framer-motion';
import './SobreNos.scss';

export default function SobreNos() {
  return (
    <div className="SobreNos" id='sobre'>
      <motion.div
        layout
        className='title animate-title'
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        SOBRE NÓS
      </motion.div>

      <div className="container">
        {[
          {
            title: 'Nossa História',
            text: 'A Shelby Barbearia foi criada em 2022 para atender um público exigente, que busca estilo, conforto e atitude. Com um ambiente pensado para o homem moderno, unimos música, conversa boa e técnicas afiadas para entregar mais do que um corte: entregamos identidade. Aqui, cada cliente encontra seu próprio estilo — Shelby é mais que uma barbearia, é uma experiência.',
            delay: 0 
          },
          {
            title: 'Ambiente',
            text: 'A vibe também conta: ambiente climatizado, trilha sonora de respeito, café na recepção e aquele bate-papo que só uma barbearia de verdade pode oferecer. Seja sua primeira visita ou a décima, você sempre será recebido como parte da família Shelby.',
            delay: 0.2
          },
          {
            title: 'Seu Tempo é valioso',
            text: 'Sabemos que tempo é um dos bens mais preciosos que você tem. Por isso, cada minuto aqui é planejado para entregar uma experiência de cuidado e estilo sem enrolação.',
            delay: 0.4
          },
        ].map(({ title, text, delay }) => (
          <motion.div
            layout
            className='card'
            key={title}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -10}}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay }}
          >
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        layout
        className='text-bottom'
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 1.2 }}
      >
        Aguardamos você !!!
      </motion.div>
    </div>
  );
}
