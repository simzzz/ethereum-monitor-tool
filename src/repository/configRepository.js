function createConfigRepository({ Configuration }) {
  async function create(newConfig) {
    return await Configuration.create(newConfig);
  }

  async function update(currentConfigName, updatedConfig) {
    await Configuration.update(updatedConfig, {
      where: {
        name: currentConfigName
      }
    });
  }

  async function findConfigByName(name) {
    return await Configuration.findOne({
      where: { name }
    });
  }

  return {
    create,
    update,
    findConfigByName
  };
}

module.exports = createConfigRepository;
