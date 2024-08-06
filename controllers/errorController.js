/**
 * Envia uma resposta de erro detalhada no ambiente de desenvolvimento.
 * @param {*} err - Objeto de erro capturado.
 * @param {*} res - Objeto de resposta.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // Stack trace do erro, útil para debugging
  });
};

/**
 * Envia uma resposta de erro apropriada no ambiente de produção.
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Se o erro for operacional, ou seja, esperado e tratado, envia detalhes
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Se o erro não for operacional, ou seja, inesperado, não envia detalhes para o cliente
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!', // Mensagem genérica para evitar exposição de informações sensíveis
    });
  }
};

/**
 * Middleware global para tratamento de erros.
 * @param {*} err - O objeto de erro capturado.
 * @param {*} req - O objeto de solicitação.
 * @param {*} res - O objeto de resposta.
 * @param {*} next - Função para passar o controle para o próximo middleware.
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack); // Imprime o stack trace do erro no console para fins de debug

  // Define um statusCode para o erro, usando 500 como padrão se não estiver definido
  err.statusCode = err.statusCode || 500;
  // Define um status para o erro, usando 'error' como padrão se não estiver definido
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res); // Envia erro detalhado em ambiente de desenvolvimento
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res); // Envia erro apropriado em ambiente de produção
  }
};
