const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
require('dotenv').config();

const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const usuariosRoutes = require('./routes/usuarios');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');

const app = express();
app.use(cors());

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rotas
app.use('/clientes', clientesRoutes);
app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// 404 handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

// Inicia servidor
// const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
//    console.log(`Servidor rodando em http://localhost:${PORT}`);
//});

module.exports = app;