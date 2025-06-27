// controllers/clienteController.js

const clienteService = require('../services/clienteService');

// Delega a busca de todos os clientes para o service.
// O service vai decidir se usa o cache ou o banco de dados.
exports.getAll = async (req, res) => {
  try {
    const clientes = await clienteService.getAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
};

// Delega a criação para o service.
// O service vai criar no banco e invalidar o cache.
exports.create = async (req, res) => {
  try {
    const cliente = req.body;
    const novo = await clienteService.create(cliente);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

// Delega a atualização para o service.
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const dados = req.body;
    const atualizado = await clienteService.update(id, dados);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

// Delega a remoção para o service.
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await clienteService.remove(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover cliente' });
  }
};
