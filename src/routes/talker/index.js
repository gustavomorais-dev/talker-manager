const express = require('express');
const {
  HTTP_OK_STATUS,
  HTTP_NOT_FOUND_STATUS,
  HTTP_CREATED_STATUS,
  HTTP_NO_CONTENT_STATUS,
} = require('../../config/constants');
const { readTalkersFile, addTalkerToTalkersFile, updateTalker } = require('../../utils/fsUtils');
const checkToken = require('../misc/checkToken');
const {
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
} = require('./validateTalker');
const { validateFiltersParams, filterData } = require('./filters');

const router = express.Router();

// GET

router.get('/', async (_req, res) => {
  const data = await readTalkersFile();
  res.status(HTTP_OK_STATUS).json(data);
});

router.get('/search', checkToken, validateFiltersParams, filterData);

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

// PUT

router.put(
  '/:id',
  checkToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const data = await readTalkersFile();
  const talkerIndex = data.findIndex((talker) => talker.id === Number(id));
  
  if (talkerIndex === -1) {
    return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }

  data[talkerIndex] = {
    id: data[talkerIndex].id,
    name,
    age,
    talk,
  };

  await updateTalker(data);
  res.status(HTTP_OK_STATUS).json(data[talkerIndex]);
},
);

// DELETE

router.delete('/:id', checkToken, async (req, res) => {
  const { id } = req.params;

  const data = await readTalkersFile();
  const talkerIndex = data.findIndex((talker) => talker.id === Number(id));
  
  if (talkerIndex === -1) {
    return res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }

  data.splice(talkerIndex, 1);

  await updateTalker(data);
  res.sendStatus(HTTP_NO_CONTENT_STATUS);
});

module.exports = router;
