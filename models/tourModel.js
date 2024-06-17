// Requere o mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');

// Definição do esquema para os documentos 'Tour' no MongoDB
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

/**
 * Criação do modelo 'Tour' baseado no esquema definido.
 * O modelo 'Tour' permite a criação de novos documentos 'Tour' no banco de dados.
 */
const Tour = mongoose.model('Tour', tourSchema);

// Exporta o módulo 'Tour' para ser usado em outros módulos
module.exports = Tour;
