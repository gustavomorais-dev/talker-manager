const express = require('express');
const { HTTP_OK_STATUS, HTTP_NOT_FOUND_STATUS, HTTP_CREATED_STATUS } = require('../../config/constants');
const { readTalkersFile, addTalkerToTalkersFile } = require('../../utils/fsUtils');
const checkToken = require('../misc/checkToken');
const validateFields = require('./validateFields');
const validateTalk = require('./validateTalk');

const router = express.Router();

// GET

router.get('/', async (_req, res) => {
  const data = await readTalkersFile();
  res.status(HTTP_OK_STATUS).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkersFile();

  const talker = talkers.find((talker) => talker.id === Number(id));

  if (talker) {
    res.status(HTTP_OK_STATUS).json(talker);
  } else {
    res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

// POST

router.post('/', checkToken, validateFields, validateTalk, async (req, res) => {
  const { name, age, talk } = req.body;

  const data = await readTalkersFile();

  const newId = data.length + 1;
  const newTalker = {
    id: newId,
    name: name,
    age: age,
    talk: talk
  };

  await addTalkerToTalkersFile(newTalker);
  res.status(HTTP_CREATED_STATUS).json(newTalker);
});

module.exports = router;
