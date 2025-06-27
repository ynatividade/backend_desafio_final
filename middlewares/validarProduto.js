module.exports = (req, res, next) => {
  const { nome, descricao, preco, data_atualizado } = req.body;

  if (!nome || typeof nome !== 'string' || nome.length < 3 || nome.length > 255) {
    return res.status(400).json({ erro: 'Nome é obrigatório e deve ter entre 3 e 255 caracteres' });
  }

  if (!descricao || typeof descricao !== 'string' || descricao.length < 3 || descricao.length > 255) {
    return res.status(400).json({ erro: 'Descrição é obrigatória e deve ter entre 3 e 255 caracteres' });
  }

  if (typeof preco !== 'number' || preco <= 0) {
    return res.status(400).json({ erro: 'Preço deve ser um número maior que zero' });
  }

  if (data_atualizado) {
    const data = new Date(data_atualizado);
    const min = new Date('2000-01-01');
    const max = new Date('2025-06-20');

    if (isNaN(data.getTime()) || data < min || data > max) {
      return res.status(400).json({ erro: 'Data inválida. Deve estar entre 01/01/2000 e 20/06/2025' });
    }
  }

  next();
};
