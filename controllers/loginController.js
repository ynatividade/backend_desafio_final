const db = require('../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const usuarioDB = rows[0];

    const senhaConfere = await bcrypt.compare(senha, usuarioDB.senha);
    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: usuarioDB.id, usuario: usuarioDB.usuario }, JWT_SECRET, { expiresIn: '1h' });

    // (Opcional) salvar o token no banco
    await db.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, usuarioDB.id]);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
};
