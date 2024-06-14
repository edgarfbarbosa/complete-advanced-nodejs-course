// Requere o mongoose para interagir com o banco de dados MongoDB
const mongoose = require('mongoose');
// Requere o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env
const dotenv = require('dotenv');
// Carrega variáveis de ambiente do arquivo config.env
dotenv.config({ path: './config.env' });

// Importa aplicação Express configurada do arquivo app.js
const app = require('./app');

// Constrói a string de conexão com o banco de dados MongoDB substituindo a senha na URI
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// Conecta ao banco de dados MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

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

// Criação do modelo 'Tour' baseado no esquema definido
const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT || 3000;
const hostname = '127.0.0.1';
/**
 * Inicia o servidor na porta especificada.
 * @param {number} port - Porta em que o servidor vai escutar.
 * @param {string} hostname - Hostname onde o servidor vai rodar.
 */
app.listen(port, hostname, () => {
  console.log(`App running on http://${hostname}:${port}`);
});
