'use client';
import { motion } from 'framer-motion';

export const AnimatedText = () => {
  const text = "Seja O Protagonista Da Sua Própria História.";
  const destaquePalavras = ['Protagonista', 'História'];

  // Geração de spans com destaque nas palavras definidas
  const renderSpans = () => {
    const spans = [];
    let currentWord = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      currentWord += char;

      // Verifica se chegou ao fim de uma palavra (espaço ou pontuação)
      const isEndOfWord = char === ' ' || i === text.length - 1 || /[.,!?;]/.test(char);

      if (isEndOfWord) {
        // Remove pontuação temporariamente para checar
        const cleanWord = currentWord.trim().replace(/[.,!?;]/g, '');

        const isHighlighted = destaquePalavras.includes(cleanWord);

        for (let j = 0; j < currentWord.length; j++) {
          const letter = currentWord[j];
          spans.push(
            <motion.span
              key={`${i}-${j}`}
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'inline-block' }}
              className={isHighlighted ? 'red' : ''}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        }

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
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.03,
          },
        },
      }}
    >
      {renderSpans()}
    </motion.div>
  );
};
