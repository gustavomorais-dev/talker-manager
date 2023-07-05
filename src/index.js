const express = require('express');
const { readTalkersFile } = require('./utils/fsUtils');
const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// Endpoint para obter todas as pessoas palestrantes
app.get('/talker', async (_request, response) => {
  const data = await readTalkersFile();
  response.status(HTTP_OK_STATUS).json(data);
});

app.listen(PORT, () => {
  console.log('Online');
});
