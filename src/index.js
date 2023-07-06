const express = require('express');
const { readTalkersFile, addTalkerToTalkersFile } = require('./utils/fsUtils');
const { isValidDate, isValidName, isValidAge, isValidTalk } = require('./utils/validateUtils');
const loginRoutes = require('./routes/login');
const { 
  HTTP_OK_STATUS,
  HTTP_CREATED_STATUS,
  HTTP_BAD_REQ_STATUS,
  HTTP_UNAUTHORIZED_STATUS,
  HTTP_NOT_FOUND_STATUS,
} = require('./config/constants');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || '3001';

// Middlewares
const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(HTTP_UNAUTHORIZED_STATUS).json({ message: 'Token não encontrado' });
  }
  if (token.length !== 16 || typeof token !== 'string') {
    return res.status(HTTP_UNAUTHORIZED_STATUS).json({ message: 'Token inválido' });
  }

  next();
};

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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.status(HTTP_OK_STATUS).send();
});

// 1 - Endpoint para obter todas as pessoas palestrantes
app.get('/talker', async (_req, res) => {
  const data = await readTalkersFile();
  res.status(HTTP_OK_STATUS).json(data);
});

// 2 - Endpoint para obter uma pessoa palestrante com base no ID
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalkersFile();

  const talker = talkers.find((talker) => talker.id === Number(id));

  if (talker) {
    res.status(HTTP_OK_STATUS).json(talker);
  } else {
    res.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

// 3, 4 - Endpoint para realizar o login e obter um token aleatório
// app.post('/login', validateLogin, (req, res) => {
//   console.log('alooo');
//   const token = generateToken();
//   res.status(HTTP_OK_STATUS).json({ token });
// });
app.use('/login', loginRoutes);

// 5 - Endpoint para adicionar uma nova pessoa palestrante
app.post('/talker', checkToken, validateFields, validateTalk, async (req, res) => {
  console.log('testt');
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

app.listen(PORT, () => {
  console.log('Online');
});
