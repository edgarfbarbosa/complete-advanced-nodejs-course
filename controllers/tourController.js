// Requere módulo File System para trabalhar com o sistema de arquivos.
const fs = require('fs');

/**
 * Lê o arquivo JSON contendo dados dos passeios e o converte para um objeto JavaScript.
 * @const {Array<Object>} tours - Array de objetos contendo os passeios.
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/**
 * Middleware para verificar a validade do ID do passeio.
 * Este middleware é chamado automaticamente quando o parâmetro :id está presenta na rota.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Função para passar o controle para o próximo middleware.
 * @param {string} val - O valor do parâmetro :id da rota.
 * @returns
 */
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);

  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

/**
 * Middleware para verificar a presença de campos obrigatórios no corpo da requisição.
 * Este middleware é chamado antes de criar um novo passeio.
 */
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

/** Manipuladores de rota */
/**
 * Rota GET para obter os dados dos passeios.
 * @param {string} path - Caminho da URL.
 * @param {function} callback - Função callback que manipula a requisição e a resposta.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
exports.getAllTours = (req, res) => {
  // Retorna uma resposta JSON com status 200 (OK) e seguindo o padrão JSend.
  res.status(200).json({
    status: 'success', // Indica que a requisição foi bem-sucedida.
    requestedAt: req.requestTime, // Hora em que a requisição foi feita.
    results: tours.length, // Número de resultados encontrados.
    data: {
      tours: tours, // Dados dos passeios.
    },
  });
};

/** Rota GET para obter os dados de um passeio específico pelo ID.
 * @param {string} path - Caminho da URL com parâmetro :id.
 */
exports.getTour = (req, res) => {
  // Converte o ID do parâmetro de string para número.
  const id = Number(req.params.id);
  // Encontra o passeio correspondente ao ID.
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour, // Dados do passeio.
    },
  });
};

/** Rota POST para adicionar um novo passeio. */
exports.createTour = (req, res) => {
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
};

/** Rota PATCH para atualizar um passeio existente. */
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here.>',
    },
  });
};

/** Rota DELETE para remover um passeio existente. */
exports.deleteTour = (req, res) => {
  // Retorna uma resposta JSON com status 204 (No Content) para indicar sucesso.
  res.status(204).json({
    status: 'success', // Indica que a remoção foi bem-sucedida.
    data: null, // Nenhum dado é retornado em uma remoção bem-sucedida.
  });
};
