'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax de camadas de fundo dirigido por scroll (validado no canvas de design).
 *
 * Uso: um "scope" (a seção) + filhos marcados com `data-parallax="<fator>"`. Cada camada
 * marcada desliza no eixo Y a uma fração da velocidade do scroll, então os elementos suaves
 * de fundo (glows, varredura diagonal, malha de pontos) ficam para trás do conteúdo em
 * primeiro plano e dão profundidade à seção.
 *
 * A matemática replica a do canvas (`translateY = -rect.top * fator`): quando o topo da
 * seção está na base da viewport a camada está em `-viewportHeight * fator`; quando o topo
 * da seção alcança o topo da viewport ela está em 0; ao sair pelo topo, em
 * `+alturaDaSeção * fator`. Aqui isso vira um tween com `scrub` do ScrollTrigger em vez de
 * um `window.addEventListener('scroll')` paralelo — os dois componentes que usam esse hook
 * (HomePage / HomePage_2) já animam com GSAP, e dois sistemas de scroll concorrentes no
 * mesmo arquivo é exatamente o tipo de conflito que queremos evitar.
 *
 * REGRA IMPORTANTE (bug recorrente pego na validação do design): nunca deixar uma animação
 * CSS e o GSAP disputarem a MESMA propriedade no MESMO elemento. Uma camada que já tem
 * `animation` mexendo em `transform` (ex: `.glow-drift`) precisa de um wrapper: o wrapper
 * fica com a animação CSS e o filho interno é quem recebe o `data-parallax`.
 */
export function useParallaxScope(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const ctx = gsap.context(() => {
      const layers = scope.querySelectorAll<HTMLElement>('[data-parallax]');

      layers.forEach((layer) => {
        const factor = Number.parseFloat(layer.dataset.parallax ?? '0');
        if (!Number.isFinite(factor) || factor === 0) return;

        gsap.fromTo(
          layer,
          { y: () => -window.innerHeight * factor },
          {
            y: () => scope.offsetHeight * factor,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scopeRef]);
}
