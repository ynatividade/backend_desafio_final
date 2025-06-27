const produtoService = require('../services/produtoService');
const cache = require('../configs/cache');
const chalk = require('chalk');

exports.getAll = async (req, res) => {
    const cacheKey = 'produtos';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(chalk.green('[CACHE] Produtos retornados do cache'));
        return res.json(cachedData);
    }

    const produtos = await produtoService.getAll();
    cache.set(cacheKey, produtos);
    console.log(chalk.blue('[DB] Produtos retornados do banco de dados'));
    res.json(produtos);
};

exports.create = async (req, res) => {
    const produto = req.body;
    const novo = await produtoService.create(produto);
    cache.del('produtos'); // invalida cache
    res.status(201).json(novo);
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const atualizado = await produtoService.update(id, dados);
    cache.del('produtos'); // invalida cache
    res.json(atualizado);
};

exports.remove = async (req, res) => {
    const id = req.params.id;
    await produtoService.remove(id);
    cache.del('produtos'); // invalida cache
    res.status(204).send();
};
