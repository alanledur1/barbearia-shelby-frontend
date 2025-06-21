'use client';
import React, { useRef, useEffect, useState } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';

export const AnimatedText = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!textRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          const split = new SplitType(textRef.current!, { types: 'chars' });

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

    <div ref={textRef} className="animated-title">
        Seja O <span className="red">Protagonista</span> Da Sua Própria <span className="red">História</span>.
    </div>
  );
};
