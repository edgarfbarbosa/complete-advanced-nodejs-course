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

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
