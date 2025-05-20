const db = require('../configs/db');
const cache = require('../configs/cache'); // caminho corrigido

exports.getAll = async () => {
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows;
};

exports.create = async (cliente) => {
    const { nome, sobrenome, email, idade } = cliente;
    const [result] = await db.query(
        'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade]
    );
    await cache.del('clientes'); // invalida cache após POST
    return { id: result.insertId, ...cliente };
};

exports.update = async (id, dados) => {
    const { nome, sobrenome, email, idade } = dados;
    await db.query(
        'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
        [nome, sobrenome, email, idade, id]
    );
    await cache.del('clientes'); // invalida cache após PUT
    return { id, ...dados };
};

exports.remove = async (id) => {
    await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    await cache.del('clientes'); // invalida cache após DELETE
};
