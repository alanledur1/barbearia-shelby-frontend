# Barbearia Shelby Frontend

Este projeto é uma aplicação de dashboard para barbeiros, permitindo que eles gerenciem seus agendamentos e informações de forma eficiente.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

```
barbearia-shelby-frontend
├── src
│   ├── app
│   │   └── barber
│   │       ├── page.tsx
│   │       └── components
│   │           └── BarberDashboard
│   │               ├── index.tsx
│   │               ├── BarberHeader.tsx
│   │               ├── AppointmentsList.tsx
│   │               ├── AppointmentCard.tsx
│   │               └── styles.module.css
│   ├── hooks
│   │   └── useBarberDashboard.ts
│   ├── services
│   │   └── api.ts
│   ├── types
│   │   └── barber.ts
│   └── context
│       └── AuthContext.tsx
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```
npm install
```

## Uso

Para iniciar a aplicação em modo de desenvolvimento, utilize:

```
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Funcionalidades

- **Autenticação**: O usuário deve estar autenticado para acessar a dashboard.
- **Gerenciamento de Agendamentos**: O barbeiro pode visualizar e gerenciar seus agendamentos.
- **Interface Intuitiva**: A dashboard é projetada para ser fácil de usar e navegar.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License.