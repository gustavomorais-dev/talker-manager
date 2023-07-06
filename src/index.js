const express = require('express');
const { readTalkersFile, addTalkerToTalkersFile } = require('./utils/fsUtils');
const { isValidDate, isValidName, isValidAge, isValidTalk } = require('./utils/validateUtils');
const loginRoutes = require('./routes/login');
const talkerRoutes = require('./routes/talker');
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

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.status(HTTP_OK_STATUS).send();
});

app.use('/login', loginRoutes);
app.use('/talker', talkerRoutes);

app.listen(PORT, () => {
  console.log('Online');
});
