# To-Do List | Front-End 🚀

Interface web moderna e responsiva desenvolvida em **React** com **TypeScript** e **Vite** para o gerenciamento de tarefas diárias. O sistema conta com autenticação de usuários (JWT), consumo de API REST segura e uma experiência de uso fluida.

---

## 🛠️ Tecnologias Utilizadas

- **React 18+** / **TypeScript**
- **Vite** (Build tool e bundler de alta performance)
- **React Router** (Gerenciamento de rotas e proteção de telas autenticadas)
- **Axios** (Comunicação HTTP com a API back-end)
- **CSS Modules / Tailwind** (Estilização da interface)

---

## ✨ Funcionalidades

- **Autenticação de Usuários:** Telas de Login e Cadastro integradas com segurança via tokens JWT.
- **Gerenciamento de Tarefas (CRUD):**
  - Criar novas tarefas com título e descrição.
  - Listar tarefas do usuário logado.
  - Marcar tarefas como concluídas ou pendentes.
  - Excluir tarefas individualmente ou limpar todas de uma vez com um clique.
- **Proteção de Rotas:** Redirecionamento automático para a tela de login caso o usuário não esteja autenticado.

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior recomendada)
- **npm** ou **yarn**

---

## 🚀 Como Rodar o Projeto Localmente

1. Clone o repositório e acesse a pasta do front-end:
   ```bash
   git clone [https://github.com/wandersonjafe/to-do-list-frontend.git](https://github.com/wandersonjafe/to-do-list-frontend.git)
   cd todolist-frontend

  1. Instale as dependências:

   npm install

  2. Crie um arquivo .env na raiz do projeto baseando-se no ambiente de desenvolvimento:
     
  VITE_API_BASE_URL=http://localhost:8080

  3. npm run dev

