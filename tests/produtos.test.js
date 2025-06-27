const request = require('supertest');
const app = require('../app');
// Adicione a linha abaixo para importar a conexão com o banco de dados
const db = require('../configs/db');

describe('Endpoints de produtos', () => {
  it('deve listar os produtos com status 200', async () => {
    const res = await request(app).get('/produtos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve criar um produto com dados válidos', async () => {
    const produto = {
      nome: 'Mouse Gamer',
      descricao: 'Mouse RGB 7200dpi',
      preco: 129.90
    };

    const res = await request(app).post('/produtos').send(produto);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve rejeitar produto com preco inválido', async () => {
    const res = await request(app).post('/produtos').send({
      nome: 'Produto Inválido',
      descricao: 'Sem preço válido',
      preco: -50
    });

    expect(res.statusCode).toBe(400);
  });

  afterAll(async () => {
    await db.end();
    // Se este arquivo usar cache, adicione a linha abaixo
    const cache = require('../configs/cache');
    cache.close();
  });
});
