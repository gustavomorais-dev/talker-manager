const { HTTP_BAD_REQ_STATUS } = require("../../config/constants");
const { isValidName, isValidAge, isValidTalk } = require("../../utils/validateUtils");

const validateFields = (req, res, next) => {
  const { name, age, talk } = req.body;

  if (!name) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "name" é obrigatório' });
  } else if (!isValidName(name)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  } else if (!age) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "age" é obrigatório' });
  } else if (!isValidAge(age)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  } else if (!talk || !isValidTalk(talk)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "talk" é obrigatório' });
  } else {
    next();
  }
};

module.exports = validateFields;