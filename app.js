// Requere módulo File System para trabalhar com o sistema de arquivos.
const fs = require('fs');
// Requere framework Express.
const express = require('express');
// Cria uma aplicação Express.
const app = express();

/**
 * Lê o arquivo JSON contendo dados dos passeios e o converte para um objeto JavaScript.
 * @const {Array<Object>} tours - Array de objetos contendo os passeios.
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Roteamento.
// Manipuladores de rota:

/**
 * Rota GET para obter os dados dos passeios.
 * @param {string} path - Caminho da URL.
 * @param {function} callback - Middleware, função callback que manipula a requisição e a resposta.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
app.get('/api/v1/tours', (req, res) => {
  // Retorna uma resposta JSON com status 200 (OK) e seguindo o padrão JSend.
  res.status(200).json({
    status: 'success', // Indica que a requisição foi bem-sucedida.
    results: tours.length, // Número de resultados encontrados.
    data: {
      tours: tours, // Dados dos passeios.
    },
  });
});

const port = 3000;
const hostname = '127.0.0.1';
/**
 * Inicia o servidor na porta especificada.
 * @param {number} port - Porta em que o servidor vai escutar.
 * @param {string} hostname - Hostname onde o servidor vai rodar.
 */
app.listen(port, hostname, () => {
  console.log(`App running on http://${hostname}:${port}`);
});
