// Requere framework Express.
const express = require('express');
// Requere módulo Morgan para registro de requisições HTTP.
const morgan = require('morgan');

// Requere manipuladores de rotas para passeios e usuários.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Cria uma aplicação Express.
const app = express();

/** Middlewares */

if (process.env.NODE_ENV === 'development') {
  // Middleware Morgan para registrar requisições HTTP no console.
  app.use(morgan('dev'));
}

/**
 * Middleware para fazer parsing do JSON no corpo das requisições.
 * O `express.json()` analisa automaticamente o corpo das requisições que têm o conteúdo
 * do tipo `application/json` e converte-o em um objeto JavaScript.
 * Isso possibilita o acesso aos dados do corpo da requisição através de `req.body`.
 */
app.use(express.json());

/**
 * Middleware para servir arquivos estáticos.
 * @param {string} root - Diretório contendo os arquivos estáticos.
 */
app.use(express.static(`${__dirname}/public`));

/**
 * Middleware global para adicionar a hora da requisição ao objeto de solicitação.
 * Esse middleware será executado em todas as requisições.
 * @param {Function} next - Função para passar o controle para o próximo middleware.
 */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/** Rotas */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/** Lidando com rotas não tratadas */
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });

  /*
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
  */
});

app.use((err, req, res, next) => {
  // Define um statusCode para o erro, usando 500 como padrão se não estiver definido
  err.statusCode = err.statusCode || 500;
  // Define um status para o erro, usando 'error' como padrão se não estiver definido
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Exporta a aplicação Express
module.exports = app;
