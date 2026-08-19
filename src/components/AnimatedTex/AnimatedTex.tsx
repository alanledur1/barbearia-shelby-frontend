'use client';
import React, { useRef, useEffect, useState } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
// O SCSS deste componente nunca era importado — a folha existia mas nunca chegava ao bundle,
// então `.animated-title` ficava sem estilo nenhum (caía na fonte do body, sem caixa alta).
import './AnimatedTex.scss';

export const AnimatedText = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // 'words, chars': o SplitType transforma cada caractere num inline-block, o que
          // permitia quebra de linha NO MEIO da palavra ("Da Sua P / rópria"). Envolvendo
          // também em words, a quebra volta a acontecer só entre palavras.
          const split = new SplitType(textRef.current!, { types: 'words,chars' });

          gsap.from(split.chars, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.03,
            ease: 'power3.out',
          });

          setHasAnimated(true); // evita reanimação
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // ativa quando 50% estiver visível
    );

    observer.observe(textRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (

    <div
      ref={textRef}
      className="animated-title text-[clamp(0.9rem,3vw+0.5rem,1.3rem)] leading-[1.4] px-[0.75rem] max-w-full sm:text-[clamp(1rem,3vw+0.5rem,1.6rem)] sm:leading-[1.35] sm:max-w-[95%] sm:px-[1rem] md:text-[clamp(1.1rem,4vw+0.5rem,3rem)] md:leading-[1.3] md:max-w-[90%]"
    >
        Seja O <span className="red">Protagonista</span> Da Sua Própria <span className="red">História</span>.
    </div>
  );
};