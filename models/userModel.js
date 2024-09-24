const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); // Importa biblioteca bcryptjs para fazer hash das senhas

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      /**
       * Valida se passwordConfirm é igual ao campo password.
       * Essa validação só funciona na criação (User.create) ou ao salvar (User.save).
       * @param {string} el - Valor do campo passwordConfirm.
       * @returns {boolean} Retorna true se os valores forem iguais, caso contrário, false.
       */
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

/**
 * Middleware que é executado antes de salvar o ddocumento no banco de dados (pre-save).
 * Se a senha não foi modificada, passa para o próximo middleware.
 * Se a senha foi modificada, faz o hash da senha com bcrypt e remove o campo passwordConfirm.
 * @param {Function} next - Callback para passar o controle para o próximo middleware.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

/**
 * Método de instância para comparar a senha fornecida pelo usuário com a senha armazenada no banco de dados.
 * Utiliza a função `compare` da biblioteca bcryptjs, que compara o hash da senha com a senha em texto simples.
 * @param {string} candidatePassword - Senha fornecida pelo usuário ao tentar fazer login.
 * @param {string} userPassword - Senha com hash armazenada no banco de dados.
 * @returns {boolean} Retorna true se as senhas conincidirem, caso contrário, false.
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Verifica se o usuário alterou a senha após o token JWT ter sido emitido.
 * Compara o timestamp de alteração da senha com o timestamp do token JWT.
 * @param {number} JWTTimestamp - Timestamp de emissão do token JWT.
 * @returns {boolean} Retorna true se a senha foi alterada após o token, caso contrário, false.
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }
  // Falso significa que não foi alterado
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
