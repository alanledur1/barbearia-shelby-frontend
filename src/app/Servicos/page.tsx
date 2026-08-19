'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Serviços deixou de ser uma página própria e virou seção âncora da landing page única
// (ver src/app/page.tsx e a referência de design em CLAUDE.md). Esta rota fica só como
// redirecionamento pra não quebrar links/favoritos antigos apontando pra /Servicos.
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#servicos');
  }, [router]);

  return null;
}
