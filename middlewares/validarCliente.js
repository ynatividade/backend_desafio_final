module.exports = (req, res, next) => {
  const { nome, sobrenome, email, idade } = req.body;

  if (!nome || typeof nome !== 'string' || nome.length < 3 || nome.length > 255) {
    return res.status(400).json({ erro: 'Nome é obrigatório e deve ter entre 3 e 255 caracteres' });
  }

  if (!sobrenome || typeof sobrenome !== 'string' || sobrenome.length < 3 || sobrenome.length > 255) {
    return res.status(400).json({ erro: 'Sobrenome é obrigatório e deve ter entre 3 e 255 caracteres' });
  }

  if (
    !email ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return res.status(400).json({ erro: 'Email inválido' });
  }

  if (!Number.isInteger(idade) || idade < 1 || idade > 119) {
    return res.status(400).json({ erro: 'Idade deve ser um número inteiro entre 1 e 119' });
  }

  next();
};
