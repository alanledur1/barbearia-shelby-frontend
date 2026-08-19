'use client';

import { motion } from 'framer-motion';
import './SobreNos.scss';

const BLOCOS = [
  {
    title: 'Nossa História',
    text: 'A Shelby Barbearia foi criada em 2022 para atender um público exigente, que busca estilo, conforto e atitude. Com um ambiente pensado para o homem moderno, unimos música, conversa boa e técnicas afiadas para entregar mais do que um corte: entregamos identidade. Aqui, cada cliente encontra seu próprio estilo — Shelby é mais que uma barbearia, é uma experiência.',
    delay: 0,
  },
  {
    title: 'Ambiente',
    text: 'A vibe também conta: ambiente climatizado, trilha sonora de respeito, café na recepção e aquele bate-papo que só uma barbearia de verdade pode oferecer. Seja sua primeira visita ou a décima, você sempre será recebido como parte da família Shelby.',
    delay: 0.2,
  },
  {
    title: 'Seu Tempo é valioso',
    text: 'Sabemos que tempo é um dos bens mais preciosos que você tem. Por isso, cada minuto aqui é planejado para entregar uma experiência de cuidado e estilo sem enrolação.',
    delay: 0.4,
  },
];

export default function SobreNos() {
  return (
    <div className="SobreNos gap-[28px] px-[25px] py-[64px] md:gap-[40px] md:px-[clamp(16px,6vw,150px)] md:py-[96px]" id='sobre'>
      <motion.div
        className='head animate-title'
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <span className="section-kicker">Quem somos</span>
        <h2 className="section-title">
          Sobre <span className="accent">Nós</span>
        </h2>
        <span className="section-rule" />
        <p className="headSubtitle">
          Mais do que cortar cabelo: um lugar onde o cuidado com o detalhe vira rotina desde 2022.
        </p>
      </motion.div>

      <div className="container">
        {BLOCOS.map(({ title, text, delay }) => (
          <motion.div
            className='card mb-[10px] md:mb-0'
            key={title}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay }}
          >
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className='text-bottom text-[20px] hidden md:text-[28px] md:block'
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
      >
        Aguardamos você
      </motion.div>
    </div>
  );
}
