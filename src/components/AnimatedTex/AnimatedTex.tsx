'use client';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AnimatedText = () => {
  const text = "Seja O Protagonista Da Sua Própria História.";
  const destaquePalavras = ['Protagonista', 'História'];

  const reduce = useReducedMotion();

  const letterVariants = reduce
    ? { hidden: { y: 0, opacity: 1 }, visible: { y: 0, opacity: 1 } }
    : { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.03,
      },
    },
  };

  const renderSpans = () => {
    const spans = [];
    let currentWord = '';
    let keyCounter = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      currentWord += char;

      const isEndOfWord = char === ' ' || i === text.length - 1 || /[.,!?;]/.test(char);

      if (isEndOfWord) {
        const cleanWord = currentWord.trim().replace(/[.,!?;]/g, '');

        // comparação case-insensitive para maior robustez
        const isHighlighted = destaquePalavras.some(
          p => p.toLowerCase() === cleanWord.toLowerCase()
        );

        for (let j = 0; j < currentWord.length; j++, keyCounter++) {
          const letter = currentWord[j];
          spans.push(
            <motion.span
              key={keyCounter}
              variants={letterVariants}
              transition={reduce ? {} : { duration: 0.45, ease: 'easeOut' }}
              className={isHighlighted ? 'red' : ''}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        }
        // depois de cada palavra, adiciona um "espaço real" que pode quebrar linha
        spans.push(<span key={`space-${keyCounter++}`}> </span>);
        currentWord = '';
      }
    }

    return spans;
  };

  return (
    <motion.div
      className="animated-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={containerVariants}
    >
      {renderSpans()}
    </motion.div>
  );
};
