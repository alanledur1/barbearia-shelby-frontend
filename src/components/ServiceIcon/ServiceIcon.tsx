// Ícone por tipo de serviço (heurística por palavra-chave no nome do serviço). Compartilhado
// entre Serviços (landing) e o wizard de Agendamento — antes cada tela usava/reusava ícones
// fixos (ou nenhum), sem relação com o serviço real. Traçado à mão (sem libs extra) pra não
// depender de nomes exatos do react-icons; validado no canvas de design antes do rollout.
export function ServiceIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (n.includes('barba')) {
    return (
      <svg {...common}>
        <path d="M3 12h11l6-4.5v9L14 12" />
        <line x1="3" y1="12" x2="1" y2="12" />
      </svg>
    );
  }
  if (n.includes('combo')) {
    return (
      <svg {...common}>
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    );
  }
  if (n.includes('degrad') || n.includes('fade')) {
    return (
      <svg {...common}>
        <line x1="5" y1="20" x2="5" y2="15" />
        <line x1="12" y1="20" x2="12" y2="9" />
        <line x1="19" y1="20" x2="19" y2="4" />
      </svg>
    );
  }
  if (n.includes('sobrancelha')) {
    return (
      <svg {...common}>
        <path d="M4 15c3-6 13-6 16 0" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}
