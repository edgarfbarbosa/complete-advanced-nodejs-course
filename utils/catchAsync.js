/**
 * Função wrapper para lidar com erros em funções assíncronas.
 * Esta função recebe uma função assíncrona e retorna uma nova função que, ao ser executada, captura qualquer erro que possa ocorrer e o encaminha para o middleware de tratamento de erros do Express.
 * @param {Function} fn - A função assíncrona que será envolvida pelo wrapper.
 * @returns {Function} Nova função que lida com o tratamento de erros automaticamente.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
