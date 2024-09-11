const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken, usado para gerar e verificar tokens JWT
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  /**
   * Ao usar esta abordagem, estamos explicitamente escolhendo
   * quais campos da requisição serão usados para criar o novo
   * usuário. Isso evita que qualquer campo não autorizado
   * (por exemplo, permissões de administrador) seja incluído na criação do usuário,
   * prevenindo brechas de segurança.
   */
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  /**
   * Gera um token JWT usando o método `sign`, passando como payload o id do novo usuário.
   * O segredo (secret) é extraído da variável de ambiente `JWT_SECRET`.
   * Define o tempo de expiração do token usando variável de ambiente `JWT_EXPIRES_IN`.
   */
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token, // Adiciona o token JWT na resposta, para que o cliente possa utilizá-lo nas próximas requisições
    data: {
      user: newUser,
    },
  });
});
