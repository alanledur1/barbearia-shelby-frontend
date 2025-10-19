'use client';

import React from 'react';
import './HomePage.scss';
import AnimatedText from '@/components/AnimatedTex/AnimatedTex';
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
        preload="auto"
      >
        <source src="/videos/shelby.webm" type="video/webm" />
      </video>

      <div className="background-overlay" />

      {/* ✅ Wrap the container div with motion.div */}
      <motion.div 
        className="title-1 title-anim"
        // Add initial and whileInView here to the container
        initial="hidden" // You might need variants if AnimatedText uses them
        whileInView="visible"
        // Use the stricter viewport setting on the container
        viewport={{ once: true, margin: "0px 0px -150px 0px", amount: 0.8 }} 
        // Optional: Add a subtle transition to the container itself if desired
        transition={{ duration: 0.5 }} 
        variants={{ // Define variants if AnimatedText expects them
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        }}
      >
        {/* AnimatedText will inherit the "visible" state when the container is in view */}
        <AnimatedText /> 
        <br /><br />
        <div className="description">
          Na barbearia Shelby, Cada Detalhe É Feito Para Você.
        </div>
      </motion.div>
      
      {/* The second title animation remains the same */}
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