CREATE DATABASE desafio;

USE desafio;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    sobrenome VARCHAR(100),
    email VARCHAR(100),
    idade INT
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao VARCHAR(255),
    preco DECIMAL(10,2),
    data_atualizado DATETIME
);
