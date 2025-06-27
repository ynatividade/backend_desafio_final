const db = require('../configs/db');

exports.create = async (usuario, senhaCriptografada) => {
  const [result] = await db.query(
    'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
    [usuario, senhaCriptografada]
  );

  return { id: result.insertId, usuario };
};

exports.getAll = async () => {
  const [rows] = await db.query('SELECT id, usuario FROM usuarios');
  return rows;
};

exports.logout = async (usuarioId) => {
  await db.query('UPDATE usuarios SET token = NULL WHERE id = ?', [usuarioId]);
};
