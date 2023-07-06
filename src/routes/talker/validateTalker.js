const { HTTP_BAD_REQ_STATUS } = require('../../config/constants');
const { isValidName, isValidAge, isValidTalk, isValidDate } = require('../../utils/validateUtils');

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "name" é obrigatório' });
  }
  if (!isValidName(name)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "age" é obrigatório' });
  }
  if (!isValidAge(age)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || !isValidTalk(talk)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const validateTalkWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  if (!talk.watchedAt || talk.watchedAt === '') {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!isValidDate(talk.watchedAt)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const invalidRateFormat = (rate) => !rate && rate !== 0;

const invalidRateValue = (rate) => !Number.isInteger(rate) || rate < 1 || rate > 5;

const validateTalkRate = (req, res, next) => {
  const { talk } = req.body;
  if (invalidRateFormat(talk.rate)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (invalidRateValue(Number(talk.rate))) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

module.exports = {
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
};