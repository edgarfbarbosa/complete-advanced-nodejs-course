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

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
