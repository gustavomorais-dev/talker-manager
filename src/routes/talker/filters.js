const { HTTP_BAD_REQ_STATUS, HTTP_OK_STATUS } = require('../../config/constants');
const { readTalkersFile } = require('../../utils/fsUtils');
const { isValidDate } = require('../../utils/validateUtils');
const { invalidRateValue } = require('./validateTalker');

function filterTalkerByName(array, query) {
  return array.filter((talker) => talker.name.toLowerCase().includes(query.toLowerCase()));
}

function filterTalkerByRate(array, rate) {
  const numericRate = Number(rate);

  return array.filter((talker) => talker.talk.rate === numericRate);
}

function filterTalkerByDate(array, date) {
  return array.filter((talker) => talker.talk.watchedAt === date);
}

function validateFiltersParams(req, res, next) {
  const { rate, date } = req.query;

  if (rate && invalidRateValue(Number(rate))) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }

  if (date && !isValidDate(date)) {
    return res.status(HTTP_BAD_REQ_STATUS)
      .json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
}

async function filterData(req, res) {
  const { q, rate, date } = req.query;
  let data = await readTalkersFile();

  if (q) {
    data = filterTalkerByName(data, q);
  }

  if (rate) {
    data = filterTalkerByRate(data, rate);
  }

  if (date) {
    data = filterTalkerByDate(data, date);
  }

  res.status(HTTP_OK_STATUS).json(data);
}

module.exports = {
  filterTalkerByName,
  filterTalkerByRate,
  filterTalkerByDate,
  validateFiltersParams,
  filterData,
};