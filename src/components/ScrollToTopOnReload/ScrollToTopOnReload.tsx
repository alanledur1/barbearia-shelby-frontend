'use client';
import { useEffect } from 'react';

export function ScrollToTopOnReload() {
  useEffect(() => {
    // Impede o navegador de restaurar o scroll automático
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Ao carregar, rola para o topo
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return null;
}
