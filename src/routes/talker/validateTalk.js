const { HTTP_BAD_REQ_STATUS } = require("../../config/constants");
const { isValidDate } = require("../../utils/validateUtils");

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk.watchedAt || talk.watchedAt === '') {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: "O campo \"watchedAt\" é obrigatório" });
  }
  if (!isValidDate(talk.watchedAt)) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: "O campo \"watchedAt\" deve ter o formato \"dd/mm/aaaa\"" });
  }
  if ((!talk.rate || talk.watchedAt === '') && talk.rate != 0) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: "O campo \"rate\" é obrigatório" });
  }
  const rate = Number(talk.rate);
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(HTTP_BAD_REQ_STATUS).json({ message: "O campo \"rate\" deve ser um número inteiro entre 1 e 5" });
  }
  next();
};

module.exports = validateTalk;