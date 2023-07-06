const { HTTP_BAD_REQ_STATUS } = require('../../config/constants');
const { isValidEmail, isValidPassword } = require('../../utils/validateUtils');

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "email" é obrigatório' });
  }
  if (!isValidEmail(email)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "password" é obrigatório' });
  }
  if (!isValidPassword(password)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
}

module.exports = validateLogin;
