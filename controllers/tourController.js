// Requere o modelo 'Tour'
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

/**
 * Middleware para definir parâmetros padrão para a rota 'top-5-cheap'.
 */
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/** Manipuladores de rota */
/**
 * Rota GET para obter os dados dos passeios.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Executa a query e armazena os resultados
    const tours = await features.query;

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
exports.updateTour = async (req, res) => {
  try {
    /**
     * Encontra e atualiza o documento correspondente pelo seu ID.
     * @param {string} req.params.id - O ID do documento que será atualizado.
     * @param {object} req.body - Objeto contendo os dados de atualização.
     * @param {boolean} options.new - Retorna o documento atualizado.
     * @param {boolean} options.runValidators - Aplica as validações do esquema do modelo durante a atualização.
     */
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour, // Dados do passeio atualizado.
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/** Rota DELETE para remover um passeio existente. */
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // Retorna uma resposta JSON com status 204 (No Content) para indicar sucesso.
    res.status(204).json({
      status: 'success',
      data: null, // É uma prática comum não enviar nenhum dado de volta ao cliente em uma operação de exclusão.
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
