const jwt = require('jsonwebtoken');
// Importe a conexão com o banco de dados
const db = require('../configs/db'); 
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Transformamos o middleware em uma função assíncrona para usar 'await'
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Erro no token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token malformatado' });
  }

  try {
    // 1. Verifica a assinatura e a expiração do token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 2. Verifica no banco de dados se o token ainda é válido
    const [rows] = await db.query('SELECT token FROM usuarios WHERE id = ?', [decoded.id]);

    // Se o usuário não for encontrado ou o token no banco for NULO (logout) ou diferente do enviado
    if (rows.length === 0 || rows[0].token !== token) {
      return res.status(401).json({ erro: 'Token inválido ou sessão encerrada' });
    }
    
    // Anexa os dados do usuário na requisição para uso posterior
    req.usuario = decoded; 

    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};
