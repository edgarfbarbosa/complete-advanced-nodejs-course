// Requere módulo File System para trabalhar com o sistema de arquivos.
const fs = require('fs');

/**
 * Lê o arquivo JSON contendo dados dos passeios e o converte para um objeto JavaScript.
 * @const {Array<Object>} tours - Array de objetos contendo os passeios.
 */
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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
};

/** Rota DELETE para remover um passeio existente. */
exports.deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Retorna uma resposta JSON com status 204 (No Content) para indicar sucesso.
  res.status(204).json({
    status: 'success', // Indica que a remoção foi bem-sucedida.
    data: null, // Nenhum dado é retornado em uma remoção bem-sucedida.
  });
};
