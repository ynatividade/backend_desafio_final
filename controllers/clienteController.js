const clienteService = require('../services/clienteService');
const cache = require('../configs/cache');
const chalk = require('chalk').default;

exports.getAll = async (req, res) => {
    const cacheKey = 'clientes';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(chalk.green('[CACHE] Clientes retornados do cache'));
        return res.json(cachedData);
    }

    const clientes = await clienteService.getAll();
    cache.set(cacheKey, clientes);
    console.log(chalk.blue('[DB] Clientes retornados do banco de dados'));
    res.json(clientes);
};

exports.create = async (req, res) => {
    const cliente = req.body;
    const novo = await clienteService.create(cliente);
    cache.del('clientes'); // invalida cache
    res.status(201).json(novo);
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const atualizado = await clienteService.update(id, dados);
    cache.del('clientes'); // invalida cache
    res.json(atualizado);
};

exports.remove = async (req, res) => {
    const id = req.params.id;
    await clienteService.remove(id);
    cache.del('clientes'); // invalida cache
    res.status(204).send();
};
