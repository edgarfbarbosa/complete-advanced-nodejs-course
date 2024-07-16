// Requere o mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

// Definição do esquema para os documentos 'Tour' no MongoDB
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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
 * Criação do modelo 'Tour' baseado no esquema definido.
 * O modelo 'Tour' permite a criação de novos documentos 'Tour' no banco de dados.
 */
const Tour = mongoose.model('Tour', tourSchema);

// Exporta o módulo 'Tour' para ser usado em outros módulos
module.exports = Tour;
