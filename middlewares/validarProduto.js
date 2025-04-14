module.exports = (req, res, next) => {
    const { nome, descricao, preco } = req.body;

    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'Nome é obrigatório e deve ser uma string' });
    }

    if (!descricao || typeof descricao !== 'string') {
        return res.status(400).json({ erro: 'Descrição é obrigatória e deve ser uma string' });
    }

    if (typeof preco !== 'number' || preco <= 0) {
        return res.status(400).json({ erro: 'Preço deve ser um número positivo' });
    }

    next();
};
