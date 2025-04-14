const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const validarCliente = require('../middlewares/validarCliente');

router.get('/', clienteController.getAll);
router.post('/', validarCliente, clienteController.create);
router.put('/:id', validarCliente, clienteController.update);
router.delete('/:id', clienteController.remove);

module.exports = router;
