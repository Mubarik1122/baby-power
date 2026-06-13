const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const root = path.join(__dirname, '..');
const backendDir = path.join(root, 'backend');
const frontendDir = path.join(root, 'frontend');

function findFreePort(start = 5001) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(findFreePort(start + 1)));
    server.listen(start, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function main() {
  const apiPort = String(await findFreePort(5001));
  const apiUrl = `http://localhost:${apiPort}/api`;

  const { MongoMemoryServer } = require(path.join(backendDir, 'node_modules/mongodb-memory-server'));
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('baby_power');

  const backendEnv = {
    ...process.env,
    PORT: apiPort,
    MONGODB_URI: uri,
    USE_MEMORY_DB: 'false',
  };

  const frontendEnvPath = path.join(frontendDir, '.env.local');
  fs.writeFileSync(
    frontendEnvPath,
    `NEXT_PUBLIC_API_URL=${apiUrl}\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n`
  );

  const frontendEnv = {
    ...process.env,
    PORT: '3000',
    NEXT_PUBLIC_API_URL: apiUrl,
  };

  console.log('\nStarting in-memory MongoDB...');
  console.log('Seeding database...\n');

  try {
    await run('node', ['src/utils/seed.js'], { cwd: backendDir, env: backendEnv });
  } catch (error) {
    await mongod.stop();
    throw error;
  }

  console.log('\nStarting backend and frontend...\n');
  console.log('  Website:  http://localhost:3000');
  console.log('  Admin:    http://localhost:3000/admin');
  console.log(`  API:      http://localhost:${apiPort}`);
  console.log('  Login:    admin@babypower.com / Admin@123456\n');

  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    env: backendEnv,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    env: frontendEnv,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  const shutdown = async () => {
    backend.kill();
    frontend.kill();
    await mongod.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
