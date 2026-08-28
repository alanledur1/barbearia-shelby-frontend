'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './sectionGlow.module.scss';

type Position = 'topLeft' | 'topRight' | 'bottomRight' | 'topCenter';

type Props = {
  /** Canto de onde o brilho nasce. */
  position?: Position;
  /** Intensidade do acento no centro do gradiente, em %. */
  intensity?: number;
};

/**
 * Brilho suave de fundo de seção, com parallax de scroll (validado no canvas de design:
 * cada `.section` tem um `.section-bg > .glow` com `data-parallax="0.08"`).
 *
 * As seções da landing têm fundo opaco (`var(--background)`), então a camada global
 * `.page-ambient` — que é `position: fixed` atrás de tudo — não aparece dentro delas. Este
 * componente devolve essa atmosfera seção a seção, e o deslocamento lento no eixo Y separa
 * o fundo do conteúdo em primeiro plano.
 *
 * Implementado com `useScroll`/`useTransform` do Framer Motion (e não com GSAP) porque é a
 * biblioteca que as seções que o consomem já usam para animar. O deslocamento é em % da
 * própria altura do brilho, o que dispensa medir a viewport e sobrevive a resize sozinho.
 *
 * A seção hospedeira precisa de `position: relative`, `overflow: hidden` e
 * `isolation: isolate` — o `z-index: -1` da camada tem que ficar atrás do conteúdo mas
 * ainda na frente do fundo da própria seção.
 */
export function SectionGlow({ position = 'topLeft', intensity = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ±12% da altura do brilho ≈ o mesmo curso do fator 0.08 do canvas em uma tela comum.
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <div ref={ref} className={styles.sectionBg} aria-hidden="true">
      <motion.div
        className={`${styles.glow} ${styles[position]}`}
        style={{
          y: prefersReducedMotion ? 0 : y,
          background: `radial-gradient(circle, color-mix(in oklab, var(--primary) ${intensity}%, transparent) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
