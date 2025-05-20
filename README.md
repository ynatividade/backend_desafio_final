# 📦 Desafio Backend + Frontend

## Como Rodar Localmente

1. **Clone o repositório ou copie os arquivos do projeto.**

2. **Crie um banco MySQL local chamado `desafio` com as tabelas:**

```sql
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  sobrenome VARCHAR(100),
  email VARCHAR(100),
  idade INT
);

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  descricao TEXT,
  preco DECIMAL(10,2),
  data_atualizado DATETIME
);
```

3. **Configure a conexão com o banco de dados em `configs/db.js`.**

4. **Instale as dependências:**

```bash
npm install
```

5. **Rode o backend:**

```bash
npm run dev
```

Você verá no terminal:
```
Servidor rodando em http://localhost:3000
```

6. **Abra o frontend:**

Abra o arquivo `frontend/index.html` diretamente no navegador.

---

## ✏️ Funcionalidades

- Cadastro, edição, listagem e exclusão de **clientes** e **produtos**
- Validação de dados com middlewares (`middlewares/validarCliente.js` e `middlewares/validarProduto.js`)
- Cache automático com expiração de 30 segundos para os endpoints GET usando `node-cache`
- Logs coloridos no terminal com `chalk` indicando origem da resposta: cache (verde) ou banco (azul)

---

## 🧪 Testando com Postman

Você pode usar o Postman para testar os endpoints diretamente:

### Clientes

- `GET http://localhost:3000/clientes`
- `POST http://localhost:3000/clientes`
- `PUT http://localhost:3000/clientes/:id`
- `DELETE http://localhost:3000/clientes/:id`

### Produtos

- `GET http://localhost:3000/produtos`
- `POST http://localhost:3000/produtos`
- `PUT http://localhost:3000/produtos/:id`
- `DELETE http://localhost:3000/produtos/:id`

**Obs:** O cache é automaticamente invalidado após qualquer operação de criação, atualização ou exclusão.

---

## 📁 Estrutura de Pastas

```
.
├── configs/
│   ├── db.js
│   └── cache.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── frontend/
└── index.js
```

---

## 📦 Dependências principais

- `express`
- `mysql2`
- `node-cache`
- `chalk` (v5 – lembre-se de usar `require('chalk').default`)