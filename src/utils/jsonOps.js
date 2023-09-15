const fs = require('fs').promises;

function jsonOps({ logger }) {
  async function readJsonFile(filepath) {
    try {
      const content = await fs.readFile(filepath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async function writeJsonFile(filepath, data) {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
  }

  async function deleteJsonFile(filepath) {
    await fs.unlink(filepath);
  }

  return {
    readJsonFile,
    writeJsonFile,
    deleteJsonFile
  };
}

module.exports = jsonOps;
