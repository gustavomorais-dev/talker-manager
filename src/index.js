const express = require('express');
const { readTalkersFile, addTalkerToTalkersFile } = require('./utils/fsUtils');
const { generateToken } = require('./utils/tokensUtils');
const { isValidEmail, isValidPassword, isValidDate } = require('./utils/validateUtils');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_BAD_REQUEST_STATUS = 400;
const HTTP_UNAUTHORIZED_STATUS = 401;
const HTTP_NOT_FOUND_STATUS = 404;
const PORT = process.env.PORT || '3001';

// Middlewares
const validateLogin = (request, response, next) => {
  const { email, password } = request.body;

  if (!email) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"email\" é obrigatório" });
  }

  if (!isValidEmail(email)) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O \"email\" deve ter o formato \"email@email.com\"" });
  }

  if (!password) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"password\" é obrigatório" });
  }

  if (!isValidPassword(password)) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O \"password\" deve ter pelo menos 6 caracteres" });
  }

  next();
};

const validateTalker = (request, response, next) => {
  const { name, age, talk } = request.body;
  const token = request.headers.authorization;

  if (!token) {
    return response.status(HTTP_UNAUTHORIZED_STATUS).json({ "message": "Token não encontrado" });
  }

  if (token.length !== 16 || typeof token !== 'string') {
    return response.status(HTTP_UNAUTHORIZED_STATUS).json({ "message": "Token inválido" });
  }

  if (!name) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"name\" é obrigatório" });
  }

  if (name.length < 3) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O \"name\" deve ter pelo menos 3 caracteres" });
  }

  if (!age) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"age\" é obrigatório" });
  }

  if (typeof age !== 'number' || !Number.isInteger(age) || age < 18) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"age\" deve ser um número inteiro igual ou maior que 18" });
  }  
  
  if (!talk || typeof talk !== 'object') {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"talk\" é obrigatório" });
  }
  
  if (!talk.watchedAt || talk.watchedAt === '') {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"watchedAt\" é obrigatório" });
  }
  
  if (!isValidDate(talk.watchedAt)) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"watchedAt\" deve ter o formato \"dd/mm/aaaa\"" });
  }

  if ((!talk.rate || talk.watchedAt === '') && talk.rate != 0) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"rate\" é obrigatório" });
  }
  
  const rate = Number(talk.rate);
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return response.status(HTTP_BAD_REQUEST_STATUS).json({ "message": "O campo \"rate\" deve ser um número inteiro entre 1 e 5" });
  }

  next();
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// 1 - Endpoint para obter todas as pessoas palestrantes
app.get('/talker', async (_request, response) => {
  const data = await readTalkersFile();
  response.status(HTTP_OK_STATUS).json(data);
});

// 2 - Endpoint para obter uma pessoa palestrante com base no ID
app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talkers = await readTalkersFile();

  const talker = talkers.find((talker) => talker.id === Number(id));

  if (talker) {
    response.status(HTTP_OK_STATUS).json(talker);
  } else {
    response.status(HTTP_NOT_FOUND_STATUS).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

// 3, 4 - Endpoint para realizar o login e obter um token aleatório
app.post('/login', validateLogin, (request, response) => {
  const token = generateToken();
  response.status(HTTP_OK_STATUS).json({ token });
});

// 5 - Endpoint para adicionar uma nova pessoa palestrante
app.post('/talker', validateTalker, async (request, response) => {
  const { name, age, talk } = request.body;

  const data = await readTalkersFile();

  const newId = data.length + 1;
  const newTalker = {
    id: newId,
    name: name,
    age: age,
    talk: talk
  };

  await addTalkerToTalkersFile(newTalker);
  response.status(HTTP_CREATED_STATUS).json(newTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
