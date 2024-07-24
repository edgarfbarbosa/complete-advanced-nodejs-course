/**
 * Classe para representar erros de aplicação personalizados.
 */
class AppError extends Error {
  /**
   * Cria uma instância de AppError.
   * @param {*} message - A mensagem de erro.
   * @param {*} statusCode - O código de status HTTP.
   */
  constructor(message, statusCode) {
    super(message); // Chama o construtor da classe pai (Error) com a mensagem de erro.

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // Captura o stack trace para a instância atual do erro.
  }
}

module.exports = AppError;
