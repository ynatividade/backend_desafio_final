const request = require('supertest');
const app = require('../app');
const db = require('../configs/db'); // Importação adicionada

describe('POST /login', () => {

  // Executa ANTES de cada teste para garantir um ambiente limpo
  beforeEach(async () => {
    // Limpa a tabela para evitar erros de usuário duplicado
    await db.query("TRUNCATE TABLE usuarios");

    // Cria o usuário de teste
    await request(app).post('/usuarios').send({
      usuario: 'loginuser',
      senha: '123456'
    });
  });

  it('deve retornar um token com usuário e senha válidos', async () => {
    const res = await request(app).post('/login').send({
      usuario: 'loginuser',
      senha: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('deve retornar 401 com senha errada', async () => {
    const res = await request(app).post('/login').send({
      usuario: 'loginuser',
      senha: 'senhaerrada'
    });

    expect(res.statusCode).toBe(401);
  });

  // afterAll continua aqui para fechar a conexão no final de todos os testes
  afterAll(async () => {
    await db.end();
  });
});
