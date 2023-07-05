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

module.exports = {
  readTalkersFile,
}
