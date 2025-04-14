const db = require('../configs/db');

exports.getAll = async () => {
    const [rows] = await db.query('SELECT * FROM produtos');
    return rows;
};

exports.create = async (produto) => {
    const { nome, descricao, preco } = produto;
    const dataAtual = new Date();
    const [result] = await db.query(
        'INSERT INTO produtos (nome, descricao, preco, data_atualizado) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, dataAtual]
    );
    return { id: result.insertId, nome, descricao, preco, data_atualizado: dataAtual };
};

exports.update = async (id, dados) => {
    const { nome, descricao, preco } = dados;
    const dataAtual = new Date();
    await db.query(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, data_atualizado = ? WHERE id = ?',
        [nome, descricao, preco, dataAtual, id]
    );
    return { id, nome, descricao, preco, data_atualizado: dataAtual };
};

exports.remove = async (id) => {
    await db.query('DELETE FROM produtos WHERE id = ?', [id]);
};
