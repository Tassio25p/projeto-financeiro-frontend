# Finanças - Sistema Financeiro em React + Vite

Projeto de controle financeiro pessoal feito com React, Vite e TailwindCSS.

## Funcionalidades implementadas

- Dashboard dinâmico com saldo, receitas, despesas e gráfico mensal
- Cadastro, edição, exclusão e filtros de transações
- Categorias dinâmicas para receitas e despesas
- Resumo de consumo com gráficos por método de pagamento e categoria
- Metas financeiras com barra de progresso
- Orçamentos mensais por categoria
- Perfil editável
- Login e cadastro visual usando localStorage
- Dados salvos no navegador com localStorage

## Tecnologias

- React
- Vite
- TailwindCSS
- React Router DOM
- Recharts

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse o endereço mostrado no terminal, geralmente:

```bash
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

## Estrutura principal

```txt
src/
├── components/
│   ├── Modal.jsx
│   └── Sidebar.jsx
├── context/
│   └── FinanceContext.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Transacoes.jsx
│   ├── Categorias.jsx
│   ├── ResumoConsumo.jsx
│   ├── Metas.jsx
│   ├── Orcamentos.jsx
│   ├── Perfil.jsx
│   ├── Login.jsx
│   └── Registro.jsx
├── utils/
│   └── formatters.js
├── App.jsx
├── index.css
└── main.jsx
```

## Observação

Nesta versão, os dados ficam salvos no navegador com localStorage. Para transformar em sistema completo com backend, o próximo passo seria criar uma API e banco de dados.
