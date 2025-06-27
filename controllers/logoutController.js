const usuarioService = require('../services/usuarioService');

exports.logout = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    await usuarioService.logout(usuarioId);

    res.json({ mensagem: 'Logout realizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao fazer logout' });
  }
};
