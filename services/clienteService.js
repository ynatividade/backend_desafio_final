const db = require('../configs/db');
const cache = require('../configs/cache');
const chalk = require('chalk');

exports.getAll = async () => {
  const cacheKey = 'clientes';
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log(chalk.green('[CACHE] Clientes retornados do cache'));
    return cached;
  }

  const [rows] = await db.query('SELECT * FROM clientes');
  cache.set(cacheKey, rows);
  console.log(chalk.blue('[DB] Clientes retornados do banco de dados'));
  return rows;
};

exports.create = async (cliente) => {
  const { nome, sobrenome, email, idade } = cliente;
  const [result] = await db.query(
    'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
    [nome, sobrenome, email, idade]
  );
  await cache.del('clientes'); // Invalida cache após alteração
  return { id: result.insertId, ...cliente };
};

exports.update = async (id, dados) => {
  const { nome, sobrenome, email, idade } = dados;
  await db.query(
    'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
    [nome, sobrenome, email, idade, id]
  );
  await cache.del('clientes'); // Invalida cache após alteração
  return { id, ...dados };
};

exports.remove = async (id) => {
  await db.query('DELETE FROM clientes WHERE id = ?', [id]);
  await cache.del('clientes'); // Invalida cache após alteração
};
