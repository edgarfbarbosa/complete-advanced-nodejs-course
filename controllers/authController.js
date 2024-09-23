const { promisify } = require('util'); // Importa o método `promisify` do módulo util
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken, usado para gerar e verificar tokens JWT
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * Gera um token JWT para autenticação do usuário.
 * O token gerado contém o ID do usuário como payload e é assinado
 * utilizando um segredo definido na variável de ambiente `JWT_SECRET`.
 * O token também tem um tempo de expiração, configurado na variável de
 * ambiente `JWT_EXPIRES_IN`.
 * @param {string} id - ID do usuário para quem o token será gerado.
 * @returns {string} Token JWT assinado, que será utilizado para autenticação.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Controlador para a rota de cadastro de novos usuários.
 * Cria um novo usuário com os dados fornecidos e gera um token JWT para ele.
 * @returns Retorna a resposta com o status de sucesso e o token JWT gerado.
 */
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

  const token = signToken(newUser._id); // Gera o token JWT para o novo usuário

  res.status(201).json({
    status: 'success',
    token, // Adiciona o token JWT na resposta, para que o cliente possa utilizá-lo nas próximas requisições
    data: {
      user: newUser,
    },
  });
});

/**
 * Controlador para a rota de login de usuários.
 * Verifica se o usuário existe e se a senha está correta.
 * Caso ambos sejam válidos, gera um token JWT e envia ao cliente.
 * @returns Retorna a resposta com o token JWT gerado.
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Verifica se email e senha foram fornecidos
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Verifica se o usuário existe e se a senha está correta
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Se tudo estiver correto, gera um token JWT e envia ao cliente
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Obtém o token e verifica se ele está presente
  let token;

  // Verifica se o cabeçalho `authorization` contém um token do tipo Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Caso o token não esteja presente, retorna um erro informando que o usuário não está logado
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verifica se o token é válido, verifica se alguém manipulou os dados ou se o token já expirou
  /**
   * Objeto contendo as informações decodificadas do token JWT.
   * É o resultado da verificação do token JWT, incluindo o payload, que contém o ID do usuário e outras informações.
   * `jwt.verify` é transformado em uma função que retorna uma Promise usando `promisify`.
   */
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Verifica se o usuário ainda existe
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        'The token belonging to this tokes user does no longer exists.',
        401,
      ),
    );
  }

  next();
});
