// Requere o mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

const slugify = require('slugify');

const validator = require('validator');

// Definição do esquema para os documentos 'Tour' no MongoDB
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // As opções toJSON e toObject permitem a inclusão de propriedades virtuais.
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/**
 * Propriedade virtual para calcular a duração do tour em semanas.
 * Utiliza o valor da propriedade 'duration' (em dias) e divide por 7.
 * Não é armazenada no banco de dados, apenas calculada na execução.
 *
 * @memberof tourSchema
 * @returns {number} - A duração do tour em semanas.
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * Adiciona o middleware pré-salvamento ao esquema 'tourSchema'.
 * Esta função será executada antes de um documento 'Tour' ser salvo no banco de dados.
 * Neste middleware, é criado um slug a partir do nome do tour. A função `slugify` é usada para gerar o slug.
 */
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/**
 * Adiciona middleware pós-salvamento ao esquema 'tourSchema'.
 * Essa função será executada depois que um documento 'Tour' for salvo no banco de dados.
 * Neste middleware, o documento salvo é registrado no console.
 * @param {object} doc - O documento 'Tour' que foi salvo.
 */
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

/**
 * Middleware pré-consulta para excluir tours secretos dos resultados de consulta.
 * Este middleware é executado antes de qualquer consulta do tipo 'find' ou 'findOne'.
 */
// tourSchema.pre('find', function (next) {
// tourSchema.pre('findOne', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

/**
 * Middleware pós-consulta para registrar os documentos encontrados no console.
 * Este middleware é executado após qualquer consulta do tipo 'find' ou 'findOne'.
 */
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   next();
// });

/**
 * Middleware pré-agregação para excluir tours secretos dos resultados de agregação.
 * Este middleware é excutado antes de qualquer operação de agregação.
 */
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

/**
 * Criação do modelo 'Tour' baseado no esquema definido.
 * O modelo 'Tour' permite a criação de novos documentos 'Tour' no banco de dados.
 */
const Tour = mongoose.model('Tour', tourSchema);

// Exporta o módulo 'Tour' para ser usado em outros módulos
module.exports = Tour;
