const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/authMiddleware');


router.post('/', usuarioController.create);
router.get('/', auth, usuarioController.getAll);

module.exports = router;
