// Requere o modelo 'Tour'
const Tour = require('./../models/tourModel');

/** Manipuladores de rota */
/**
 * Rota GET para obter os dados dos passeios.
 * @param {string} path - Caminho da URL.
 * @param {function} callback - Função callback que manipula a requisição e a resposta.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
exports.getAllTours = async (req, res) => {
  try {
    // Usa o método find para buscar todos os documentos na coleção 'tours'
    const tours = await Tour.find();

    // Retorna uma resposta JSON com status 200 (OK) e seguindo o padrão JSend:
    res.status(200).json({
      status: 'success', // Indica que a requisição foi bem-sucedida.
      results: tours.length, // Número de resultados encontrados.
      data: {
        tours: tours, // Dados dos passeios.
      },
    });
  } catch (err) {
    // Retorna uma resposta JSON com status 404 (Not Found) se houver um erro na busca:
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/** Rota GET para obter os dados de um passeio específico pelo ID.
 * @param {string} path - Caminho da URL com parâmetro :id.
 */
exports.getTour = async (req, res) => {
  try {
    // Usa o método findById() para buscar um documento na coleção 'tours' pelo ID
    const tour = await Tour.findById(req.params.id);

    // Retorna uma resposta JSON com status 200 (OK) se documento for encontrado:
    res.status(200).json({
      status: 'success',
      data: {
        tour, // Dados do passeio.
      },
    });
  } catch (err) {
    // Retorna uma resposta JSON com status 404 (Not Found) se houver um erro na busca ou se o documento não for encontrado:
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/** Rota POST para adicionar um novo passeio. */
exports.createTour = async (req, res) => {
  try {
    // Cria um novo passeio no banco de dados usando o modelo Tour
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);

    // Retorna uma resposta JSON com status 201 (Created) indicando sucesso.
    res.status(201).json({
      status: 'success', // Indicia que a criação do recurso foi bem-sucedida.
      data: {
        tour: newTour, // Novo passeio criado.
      },
    });
  } catch (err) {
    // Retorna uma resposta JSON com status 400 (Bad Request) se houver um erro.
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
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
