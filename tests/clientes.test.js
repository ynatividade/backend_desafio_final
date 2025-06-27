// Dependências de teste
const request = require('supertest');
const app = require('../app');
const db = require('../configs/db');
const cache = require('../configs/cache');

describe('Testes da Rota /clientes', () => {

  // Token será redefinido antes de cada teste
  let token;

  // Hook executado ANTES DE CADA teste ('it').
  // Garante um ambiente limpo e isolado para cada caso de teste.
  beforeEach(async () => {
    // 1. Limpa dados de execuções anteriores para garantir isolamento total
    await db.query('TRUNCATE TABLE clientes');
    await db.query('TRUNCATE TABLE usuarios');
    cache.flushAll();

    // 2. Cria um usuário e obtém um novo token para cada teste
    const randomUser = `testuser_${Date.now()}`;
    const password = 'password123';

    // Cria o usuário e aguarda a confirmação
    const registerResponse = await request(app)
      .post('/usuarios')
      .send({
        usuario: randomUser,
        senha: password
      });

    if (registerResponse.statusCode !== 201) {
      throw new Error(`Falha no setup do teste: Não foi possível criar o usuário. Status: ${registerResponse.statusCode}`);
    }

    const loginResponse = await request(app)
      .post('/login')
      .send({
        usuario: randomUser,
        senha: password
      });
    
    if (loginResponse.statusCode !== 200 || !loginResponse.body.token) {
        throw new Error('Falha no setup do teste: Token não foi obtido no bloco beforeEach, mesmo após criar o usuário.');
    }

    token = loginResponse.body.token;
  });

  describe('GET /clientes', () => {
    it('deve retornar 200 e uma lista de clientes com token válido', async () => {
      // Garante que o token existe antes da requisição
      if (!token) {
        throw new Error('O token é nulo ou indefinido no momento do teste.');
      }

      const res = await request(app)
        .get('/clientes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve retornar 401 (Não Autorizado) ao tentar acessar sem um token', async () => {
      const res = await request(app).get('/clientes');
      expect(res.statusCode).toBe(401);
    });

    it('deve retornar 401 (Não Autorizado) com um token inválido/malformado', async () => {
        const res = await request(app)
          .get('/clientes')
          .set('Authorization', 'Bearer tokeninvalido123');
        expect(res.statusCode).toBe(401);
      });
  });

  // Hook executado uma vez após todos os testes da suíte.
  // Realiza o teardown do ambiente de teste.
  afterAll(async () => {
    // Encerra as conexões ativas para evitar erros de "open handles" no Jest.
    await db.end();
    cache.close();
  });
});
