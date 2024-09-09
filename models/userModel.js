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

const User = mongoose.model('User', userSchema);

module.exports = User;
