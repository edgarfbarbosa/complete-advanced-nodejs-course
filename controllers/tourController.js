// Requere o modelo 'Tour'
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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
exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

/** Rota GET para obter os dados de um passeio específico pelo ID.
 * @param {string} path - Caminho da URL com parâmetro :id.
 */
exports.getTour = catchAsync(async (req, res, next) => {
  // Usa o método findById() para buscar um documento na coleção 'tours' pelo ID
  const tour = await Tour.findById(req.params.id);

  // Retorna uma resposta JSON com status 200 (OK) se documento for encontrado:
  res.status(200).json({
    status: 'success',
    data: {
      tour, // Dados do passeio.
    },
  });
});

/** Rota POST para adicionar um novo passeio. */
exports.createTour = catchAsync(async (req, res, next) => {
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
});

/** Rota PATCH para atualizar um passeio existente. */
exports.updateTour = catchAsync(async (req, res, next) => {
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
});

/** Rota DELETE para remover um passeio existente. */
exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  // Retorna uma resposta JSON com status 204 (No Content) para indicar sucesso.
  res.status(204).json({
    status: 'success',
    data: null, // É uma prática comum não enviar nenhum dado de volta ao cliente em uma operação de exclusão.
  });
});

/**
 * Obtém estatísticas de tours agregados, como a média de avaliações, preços e quantidade.
 * @returns Retorna um objeto JSON com o status e os dados das estatísticas.
 */
exports.getTourStats = catchAsync(async (req, res, next) => {
  // Executa um pipeline de agregação na coleção 'Tour'
  const stats = await Tour.aggregate([
    // Primeira etapa: filtra tours com média de avaliações maior ou igual a 4.5
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    // Segunda etapa: agrupa os documentos por dificuldade e calcula estatísticas
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
    // Terceira etapa: ordena os grupos pelo preço médio em ordem crescente
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
});

/**
 * Obtém um plano mensal para tours, mostrando a quantidade de inícios de tours por mês e os nomes dos tours.
 * @returns Retorna um objeto JSON com os dados do número de tours iniciados em cada mês.
 */
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // Converte o ano passado como parâmetro para um número
  const year = req.params.year * 1;

  // Executa um pipeline de agregação na coleção 'Tour'
  const plan = await Tour.aggregate([
    // Primeira etapa: desestrutura a array de datas de início para documentos separados
    {
      $unwind: '$startDates',
    },
    // Segunda etapa: filtra documentos cujas datas de início estão dentro do ano especificado
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // Terceira etapa: agrupa documentos pelo mês de início e acumula dados
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    // Quarta etapa: adiciona o campo 'month' aos documentos do grupo
    {
      $addFields: { month: '$_id' },
    },
    // Quinta etapa: projeta os documentos para excluir o campo '_id'
    {
      $project: { _id: 0 },
    },
    // Sexta etapa: ordena os documentos pelo número de inícios de tours em ordem decrescente
    {
      $sort: { numTourStarts: -1 },
    },
    // Sétima etapa: limita o resultado aos 12 documentos principais
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
