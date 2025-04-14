const clienteService = require('../services/clienteService');

exports.getAll = async (req, res) => {
    const clientes = await clienteService.getAll();
    res.json(clientes);
};

exports.create = async (req, res) => {
    const cliente = req.body;
    const novo = await clienteService.create(cliente);
    res.status(201).json(novo);
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const dados = req.body;
    const atualizado = await clienteService.update(id, dados);
    res.json(atualizado);
};

exports.remove = async (req, res) => {
    const id = req.params.id;
    await clienteService.remove(id);
    res.status(204).send();
};
