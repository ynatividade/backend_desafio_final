const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, logoutController.logout);

module.exports = router;
