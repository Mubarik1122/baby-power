const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, '..', 'backend');

async function main() {
  const { MongoMemoryServer } = require(path.join(backendDir, 'node_modules/mongodb-memory-server'));
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('baby_power');

  console.log('Using temporary in-memory MongoDB for seeding...');
  console.log('Note: data is not persisted. Use "npm run dev" to run the full app with seeded data.\n');

  await new Promise((resolve, reject) => {
    const child = spawn('node', ['src/utils/seed.js'], {
      cwd: backendDir,
      env: { ...process.env, MONGODB_URI: uri },
      stdio: 'inherit',
      shell: true,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Seed failed with code ${code}`));
    });
  });

  await mongod.stop();
  console.log('\nSeed completed (in-memory only — run "npm run dev" to start the app with data).');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
