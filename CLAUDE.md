# CLAUDE.md — Barbearia Shelby (frontend)

Arquivo de contexto para o Claude Code. Lido automaticamente ao iniciar sessões neste repositório.
Atualize este arquivo conforme o projeto evolui.

> Contexto geral do projeto (frontend + backend, deploy, convenções compartilhadas) está em
> `CLAUDE.md` na pasta raiz `Barber project/` — não versionado aqui.

## Visão Geral

Frontend em Next.js (App Router) do sistema de agendamento da Barbearia Shelby: cadastro/login
de clientes, fluxo de agendamento e painel administrativo. Consome a API do repositório
`barbearia-backend` (separado).

## Estrutura

```
barbearia-shelby-frontend/
├── src/
│   ├── app/                 # Rotas (App Router)
│   │   ├── Login/
│   │   ├── CriarConta/
│   │   ├── EsqueciSenha/
│   │   ├── Servicos/
│   │   ├── agendamento/
│   │   ├── meus-servicos/
│   │   └── barber/          # Área do barbeiro (billing, etc.)
│   ├── components/          # Componentes reutilizáveis por página/feature
│   ├── context/             # React context (ex: auth)
│   ├── hooks/
│   ├── schemas/             # Validação com Zod
│   ├── services/            # Chamadas à API (axios)
│   └── images/
├── public/                  # Assets estáticos
├── eslint.config.mjs
├── next.config.ts
└── package.json
```

## Stack Técnica

| Item        | Tecnologia                        |
|-------------|-------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack) |
| UI          | React 19 + TypeScript              |
| Estilo      | Sass                                |
| Animação    | Framer Motion, GSAP, Popmotion      |
| Validação   | Zod                                 |
| HTTP        | axios                               |
| Auth        | JWT (jwt-decode) via context/hooks  |
| Testes      | Jest + Testing Library + Cypress    |
| Deploy      | Vercel                              |

## Comandos

```bash
npm run dev        # Desenvolvimento com Turbopack (http://localhost:3000)
npm run build       # Build de produção
npm start           # Rodar build
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm test             # Jest
```

## Variáveis de Ambiente (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Páginas e Rotas

| Rota            | Descrição                          |
|------------------|--------------------------------------|
| `/`              | Home — hero, sobre e contato         |
| `/Servicos`      | Lista de serviços da barbearia       |
| `/Login`         | Login de usuário                     |
| `/CriarConta`    | Cadastro de usuário                  |
| `/EsqueciSenha`  | Recuperação de senha                 |
| `/agendamento`   | Fluxo de agendamento                 |
| `/meus-servicos` | Serviços/agendamentos do cliente     |
| `/barber`        | Área do barbeiro (billing, etc.)     |

## Convenções

- Nomenclatura de rotas/páginas: PascalCase quando a página é "pública/institucional"
  (`/Login`, `/CriarConta`, `/Servicos`); kebab-case para áreas internas mais recentes
  (`/meus-servicos`, `/barber`). Seguir o padrão já usado na pasta correspondente.
- TypeScript estrito.
- Componentes organizados por feature em `src/components/`.
- Commits: <!-- TODO: definir padrão -->
- Branches: <!-- TODO: definir estratégia -->

## Regras para o Claude Code

- Nunca commitar arquivos `.env.local`.
- Rodar `npm run lint` após mudanças relevantes.
- Mudanças que dependem de novas rotas/campos da API precisam ser sinalizadas — o backend
  é um repositório separado e pode não ter o endpoint ainda.
- Novas páginas devem seguir o padrão de nomenclatura já estabelecido (ver Convenções).

## Deploy

Vercel — deploy automático via push na branch principal.
URL: https://barbearia-shelby-frontend.vercel.app/

## TODO / Próximos Passos

- [ ] Definir padrão de commits
- [ ] Definir estratégia de branches
- [ ] Padronizar nomenclatura de rotas (PascalCase vs kebab-case)
- [ ] Ampliar cobertura de testes (Jest/Cypress)

---
Última atualização: 2026-07-28
