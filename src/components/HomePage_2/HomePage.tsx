'use client';

import React from 'react';
import './HomePage.scss';
import { AnimatedText } from '@/components/AnimatedTex/AnimatedTex';
import { motion } from 'framer-motion';

export const HomePage_2 = () => {
  return (
    <div className="HomePage_2">
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src="/videos/shelby.webm" type="video/webm" />
      </video>

      <div className="background-overlay" />

      {/* AnimatedText permanece como está */}
      <div className="title-1 title-anim">
        <AnimatedText />
        <br /><br />
        <div className="description">
          Na barbearia Shelby, Cada Detalhe É Feito Para Você.
        </div>
      </div>

      {/* Título 2 com animação moderna via whileInView */}
      <motion.div
        className="title-2"
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        Na <span className="red">Shelby</span>, Cada <span className="red">Corte</span> É <br />
        Mais Do Que Um <br />
        <span className="red">Simples</span> Serviço
        <br />
        <br />
        <div className="description">
          A Arte De Cortar. A Precisão De Um Shelby.
        </div>
      </motion.div>
    </div>
  );
};
