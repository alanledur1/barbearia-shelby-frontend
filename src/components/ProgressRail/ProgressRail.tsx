'use client';

import { useEffect, useState } from 'react';
import styles from './progressRail.module.scss';

// Trilha de progresso da landing (validada no canvas de design) — pontinhos fixos na
// lateral esquerda indicando em qual seção o visitante está. Só existe nesta página: cada
// seção de topo marca sua própria raiz com `data-progress-section`, e este componente
// observa quantas existem (não fica preso a um número fixo).
export function ProgressRail() {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-progress-section]'));
    setCount(sections.length);
    if (sections.length === 0) return;

    // rootMargin -50%/-50%: a interseção só "acontece" quando a seção cruza a linha
    // horizontal exata do meio da viewport — cada mudança de estado é uma troca limpa de
    // seção ativa, sem precisar calcular scroll manualmente.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  return (
    <nav className={styles.rail} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`${styles.dot} ${i === active ? styles.isActive : ''}`} />
      ))}
    </nav>
  );
}
