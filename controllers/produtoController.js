const produtoService = require('../services/produtoService');

exports.getAll = async (req, res) => {
    const produtos = await produtoService.getAll();
    res.json(produtos);
};

exports.create = async (req, res) => {
    const produto = req.body;
    const novo = await produtoService.create(produto);
    res.status(201).json(novo);
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const atualizado = await produtoService.update(id, dados);
    res.json(atualizado);
};

exports.remove = async (req, res) => {
    const id = req.params.id;
    await produtoService.remove(id);
    res.status(204).send();
};
