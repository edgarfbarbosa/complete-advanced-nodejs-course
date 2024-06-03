// Importa aplicação Express configurada do arquivo app.js
const app = require('./app');

const port = 3000;
const hostname = '127.0.0.1';
/**
 * Inicia o servidor na porta especificada.
 * @param {number} port - Porta em que o servidor vai escutar.
 * @param {string} hostname - Hostname onde o servidor vai rodar.
 */
app.listen(port, hostname, () => {
  console.log(`App running on http://${hostname}:${port}`);
});
