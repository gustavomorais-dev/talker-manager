const express = require('express');
const { readTalkersFile } = require('./utils/fsUtils');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOT_FOUND_STATUS = 404;
const PORT = process.env.PORT || '3001';

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


app.listen(PORT, () => {
  console.log('Online');
});
