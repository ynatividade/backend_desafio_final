const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await usuarioService.create(usuario, senhaCriptografada);

    res.status(201).json({ id: novoUsuario.id, usuario: novoUsuario.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};
exports.getAll = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAll();
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
};
