// Requere módulo File System para trabalhar com o sistema de arquivos.
const fs = require('fs');
// Requere framework Express.
const express = require('express');
// Cria uma aplicação Express.
const app = express();

/**
 * Middleware para fazer parsing do JSON no corpo das requisições.
 * O `express.json()` analisa automaticamente o corpo das requisições que têm o conteúdo
 * do tipo `application/json` e converte-o em um objeto JavaScript.
 * Isso possibilita o acesso aos dados do corpo da requisição através de `req.body`.
 */
app.use(express.json());

/**
 * Lê o arquivo JSON contendo dados dos passeios e o converte para um objeto JavaScript.
 * @const {Array<Object>} tours - Array de objetos contendo os passeios.
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/** Roteamento: */

/**
 * Rota GET para obter os dados dos passeios.
 * @param {string} path - Caminho da URL.
 * @param {function} callback - Função callback que manipula a requisição e a resposta.
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

/** Rota GET para obter os dados de um passeio específico pelo ID.
 * @param {string} path - Caminho da URL com parâmetro :id.
 */
app.get('/api/v1/tours/:id', (req, res) => {
  // Converte o ID do parâmetro de string para número.
  const id = Number(req.params.id);
  // Encontra o passeio correspondente ao ID.
  const tour = tours.find((el) => el.id === id);

  // Verifica se o passeio existe
  if (!tour) {
    // Retorna uma resposta JSON com status 404 (Not Found) se o ID do passeio for inválido.
    return res.status(404).json({
      status: 'fail', // Indica que a requisição falhou.
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour, // Dados do passeio.
    },
  });
});

/** Rota POST para adicionar um novo passeio. */
app.post('/api/v1/tours', (req, res) => {
  // Cria um novo ID baseado no último ID do array de passeios.
  const newId = tours[tours.length - 1].id + 1;
  // Cria um novo objeto tour combinando o novo ID com os dados do corpo da requisição.
  const newTour = Object.assign({ id: newId }, req.body);
  // Adiciona o novo passeio ao array de passeios.
  tours.push(newTour);
  // Adiciona novo passeio no arquivo JSON.
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // Retorna uma resposta JSON com status 201 (Created) seguindo o padrão JSend.
      res.status(201).json({
        status: 'success', // Indicia que a criação do recurso foi bem-sucedida.
        data: {
          tour: newTour, // Novo passeio criado.
        },
      });
    }
  );
});

/** Rota PATCH para atualizar um passeio existente. */
app.patch('/api/v1/tours/:id', (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here.>',
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
