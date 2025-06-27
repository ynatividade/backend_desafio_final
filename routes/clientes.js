const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const validarCliente = require('../middlewares/validarCliente');
// O middleware de autenticação que será usado para proteger as rotas
const auth = require('../middlewares/authMiddleware');

// --- Rotas Protegidas ---
// O middleware 'auth' é adicionado como um argumento antes do controller.
// O Express executará o 'auth' primeiro. Se o token for válido, ele chamará o 'next()'
// e a execução continuará para o 'clienteController.getAll'.
// Se o token for inválido, o middleware 'auth' retornará um erro 401 e a execução para.

// Rota para listar todos os clientes (agora protegida)
router.get('/', auth, clienteController.getAll);

// Rota para criar um cliente (agora protegida)
// A ordem dos middlewares importa: primeiro autentica (auth), depois valida (validarCliente)
router.post('/', auth, validarCliente, clienteController.create);

// Rota para atualizar um cliente (agora protegida)
router.put('/:id', auth, validarCliente, clienteController.update);

// Rota para remover um cliente (agora protegida)
router.delete('/:id', auth, clienteController.remove);

module.exports = router;
