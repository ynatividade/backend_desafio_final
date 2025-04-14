const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const validarProduto = require('../middlewares/validarProduto');

router.get('/', produtoController.getAll);
router.post('/', validarProduto, produtoController.create);
router.put('/:id', validarProduto, produtoController.update);
router.delete('/:id', produtoController.remove);

module.exports = router;
