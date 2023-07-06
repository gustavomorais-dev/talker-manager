const fs = require('fs').promises;
const path = require('path');

async function readTalkersFile() {
  try {
    const filePath = path.resolve(__dirname, '../talker.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
    throw err;
  }
}

async function addTalkerToTalkersFile(talker) {
  try {
    const filePath = path.resolve(__dirname, '../talker.json');
    const data = await readTalkersFile();
    data.push(talker);
    const dataJSON = JSON.stringify(data);
    await fs.writeFile(filePath, dataJSON);
  } catch (err) {
    console.error(`Erro ao adicionar o talker ao arquivo: ${err.message}`);
    throw err;
  }
}

module.exports = {
  readTalkersFile,
  addTalkerToTalkersFile,
};
