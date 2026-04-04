<div align="center">

<img src="https://barbearia-shelby-frontend.vercel.app/_next/image?url=%2Fimages%2Flogo.png&w=96&q=75" alt="Logo Shelby" width="80"/>

# Barbearia Shelby — Frontend

Plataforma completa de agendamento para barbearia com autenticação de clientes, painel administrativo e gestão de horários.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://barbearia-shelby-frontend.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![SCSS](https://img.shields.io/badge/SCSS-estilização-pink?style=flat-square&logo=sass)](https://sass-lang.com)

🔗 **[Ver projeto ao vivo](https://barbearia-shelby-frontend.vercel.app)** &nbsp;|&nbsp; 🔧 **[Repositório do Backend](https://github.com/alanledur1/barbearia-backend)**

</div>

---

## 📋 Sobre o projeto

A **Barbearia Shelby** é uma aplicação fullstack desenvolvida para modernizar o atendimento de uma barbearia real. O sistema permite que clientes criem uma conta, façam login e agendem horários online. Administradores têm acesso a um painel para gerenciar agendamentos e serviços.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — Cadastro e login de clientes com JWT
- 📅 **Agendamento online** — Escolha de serviço, barbeiro e horário disponível
- 👤 **Painel do cliente** — Visualização e gerenciamento dos próprios agendamentos
- 🛡️ **Painel administrativo** — Gerenciamento completo de agendamentos, clientes e serviços
- 📱 **Responsivo** — Layout adaptado para mobile e desktop

---

## 🚀 Tecnologias

### Frontend
| Tecnologia | Uso |
|---|---|
| [Next.js 15](https://nextjs.org) | Framework React com App Router |
| [TypeScript](https://www.typescriptlang.org) | Tipagem estática |
| [SCSS](https://sass-lang.com) | Estilização modular |

### Backend
> Repositório separado: [barbearia-backend](https://github.com/alanledur1/barbearia-backend)

| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Servidor da API |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Banco de dados relacional |
| JWT | Autenticação e autorização |

---

## 🖥️ Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm
- Backend rodando ([instruções aqui](https://github.com/alanledur1/barbearia-backend))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/alanledur1/barbearia-shelby-frontend.git

# Entre na pasta
cd barbearia-shelby-frontend

# Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Rodando o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura do projeto

```
src/
├── app/                  # Rotas (App Router do Next.js)
│   ├── page.tsx          # Página inicial
│   ├── Login/            # Página de login
│   ├── CriarConta/       # Cadastro de usuário
│   ├── agendamento/      # Fluxo de agendamento
│   ├── Servicos/         # Lista de serviços
│   └── admin/            # Painel administrativo
├── components/           # Componentes reutilizáveis
└── styles/               # Arquivos SCSS globais
```

---

## 🌐 Deploy

O frontend está hospedado na **Vercel**. Acesse em:
**[https://barbearia-shelby-frontend.vercel.app](https://barbearia-shelby-frontend.vercel.app)**

---

## 👨‍💻 Autor

Desenvolvido por **Alan Ledur**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Alan%20Ledur-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/alan-ledur/)
[![GitHub](https://img.shields.io/badge/GitHub-alanledur1-black?style=flat-square&logo=github)](https://github.com/alanledur1)
[![Portfolio](https://img.shields.io/badge/Portfolio-alan--ledur.vercel.app-green?style=flat-square)](https://alan-ledur.vercel.app)
