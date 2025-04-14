module.exports = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;

    if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'Nome é obrigatório e deve ser uma string' });
    }

    if (!sobrenome || typeof sobrenome !== 'string') {
        return res.status(400).json({ erro: 'Sobrenome é obrigatório e deve ser uma string' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ erro: 'Email inválido' });
    }

    if (!Number.isInteger(idade) || idade <= 0) {
        return res.status(400).json({ erro: 'Idade deve ser um número inteiro positivo' });
    }

    next();
};
