const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

async function startMemoryMongo() {
  if (memoryServer) {
    return memoryServer.getUri('baby_power');
  }

  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri('baby_power');
  console.log('Using in-memory MongoDB (no local install required)');
  return uri;
}

async function stopMemoryMongo() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { startMemoryMongo, stopMemoryMongo };
