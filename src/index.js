const express = require('express');
const { readTalkersFile } = require('./utils/fsUtils');
const { generateToken } = require('./utils/tokensUtils');
const { isValidEmail, isValidPassword } = require('./utils/validateUtils');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_BAD_REQUEST_STATUS = 400;
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

// 3 - Endpoint para realizar o login e obter um token aleatório
app.post('/login', validateLogin, (request, response) => {
  const token = generateToken();
  response.status(HTTP_OK_STATUS).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
