'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Botão "voltar ao topo" + bolha do WhatsApp, validados no canvas de design. Mesma regra do
// Navbar/Footer: dentro de /barber a navegação vive na Sidebar, então essas ações do site
// público não devem sobrepor o painel interno.
export function FloatingActions() {
  const pathname = usePathname();
  const isDashboardArea = pathname?.startsWith('/barber') ?? false;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isDashboardArea) return;

    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDashboardArea]);

  if (isDashboardArea) return null;

  return (
    <>
      <button
        className={`back-to-top${visible ? ' is-visible' : ''}`}
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      <a
        className="whatsapp-bubble"
        href="https://wa.me/5551998177919"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </>
  );
}
