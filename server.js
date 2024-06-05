// Requere o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env
const dotenv = require('dotenv');
// Carrega variáveis de ambiente do arquivo config.env
dotenv.config({ path: './config.env' });

// Importa aplicação Express configurada do arquivo app.js
const app = require('./app');

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
