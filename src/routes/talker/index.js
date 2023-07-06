const express = require('express');
const {
  HTTP_OK_STATUS,
  HTTP_NOT_FOUND_STATUS,
  HTTP_CREATED_STATUS,
} = require('../../config/constants');
const { readTalkersFile, addTalkerToTalkersFile } = require('../../utils/fsUtils');
const checkToken = require('../misc/checkToken');
const {
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
} = require('./validateTalker');

const router = express.Router();

// GET

router.get('/', async (_req, res) => {
  const data = await readTalkersFile();
  res.status(HTTP_OK_STATUS).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkersFile();

  const talker = talkers.find((t) => t.id === Number(id));

  if (talker) {
    res.status(HTTP_OK_STATUS).json(talker);
  } else {
    res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

// POST

router.post(
  '/',
  checkToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
  const { name, age, talk } = req.body;

  const data = await readTalkersFile();

  const id = data.length + 1;
  const newTalker = {
    id,
    name,
    age,
    talk,
  };

  await addTalkerToTalkersFile(newTalker);
  res.status(HTTP_CREATED_STATUS).json(newTalker);
},
);

module.exports = router;
