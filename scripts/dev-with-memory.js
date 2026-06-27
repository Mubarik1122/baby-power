const { spawn, execSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const path = require('path');

const root = path.join(__dirname, '..');
const backendDir = path.join(root, 'backend');
const frontendDir = path.join(root, 'frontend');

require(path.join(backendDir, 'node_modules/dotenv')).config({
  path: path.join(backendDir, '.env'),
});

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

function killPid(pid) {
  if (!pid) return;
  try {
    process.kill(pid, 0);
    process.kill(pid, 'SIGTERM');
  } catch {
    return;
  }
  try {
    execSync(`kill -9 ${pid} 2>/dev/null`, { stdio: 'ignore' });
  } catch {
    // Process already exited.
  }
}

function cleanupStaleDevServers() {
  const lockPath = path.join(frontendDir, '.next/dev/lock');
  let clearedCache = false;

  if (fs.existsSync(lockPath)) {
    try {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      if (lock.pid) {
        console.log(`Stopping stale Next.js dev server (PID ${lock.pid})...`);
        killPid(Number(lock.pid));
      }
    } catch {
      // Ignore invalid lock files.
    }
    try {
      fs.unlinkSync(lockPath);
    } catch {
      // Ignore lock removal errors.
    }
    clearedCache = true;
  }

  for (const port of [3000, 3001]) {
    try {
      const pids = execSync(`lsof -ti :${port}`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      if (pids.length > 0) clearedCache = true;
      for (const pid of pids) {
        killPid(Number(pid));
      }
    } catch {
      // Port is free.
    }
  }

  if (clearedCache) {
    const nextDir = path.join(frontendDir, '.next');
    if (fs.existsSync(nextDir)) {
      console.log('Clearing stale Next.js cache (.next)...');
      fs.rmSync(nextDir, { recursive: true, force: true });
    }
  }
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
  cleanupStaleDevServers();

  const apiPort = String(await findFreePort(5001));
  const frontendPort = String(await findFreePort(3000));
  const apiUrl = `http://localhost:${apiPort}/api`;
  const siteUrl = `http://localhost:${frontendPort}`;

  const useMemoryDb = process.env.USE_MEMORY_DB === 'true' || !process.env.MONGODB_URI;
  let mongod;
  let mongoUri = process.env.MONGODB_URI;

  if (useMemoryDb) {
    const { MongoMemoryServer } = require(path.join(backendDir, 'node_modules/mongodb-memory-server'));
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri('little_star');
    console.log('\nUsing in-memory MongoDB (data resets when dev stops).');
    console.log('For persistent settings, set MONGODB_URI in backend/.env and USE_MEMORY_DB=false\n');
  } else {
    console.log('\nUsing persistent MongoDB from backend/.env');
    console.log('Admin settings will be saved to the database across restarts.\n');
  }

  const backendEnv = {
    ...process.env,
    PORT: apiPort,
    MONGODB_URI: mongoUri,
    USE_MEMORY_DB: 'false',
  };

  const frontendEnvPath = path.join(frontendDir, '.env.local');
  fs.writeFileSync(
    frontendEnvPath,
    `NEXT_PUBLIC_API_URL=${apiUrl}\nNEXT_PUBLIC_SITE_URL=${siteUrl}\n`
  );

  const frontendEnv = {
    ...process.env,
    PORT: frontendPort,
    NEXT_PUBLIC_API_URL: apiUrl,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  };

  console.log('Preparing database (seed only if empty)...\n');

  try {
    await run('node', ['src/utils/seed.js'], { cwd: backendDir, env: backendEnv });
  } catch (error) {
    if (mongod) await mongod.stop();
    throw error;
  }

  console.log('\nStarting backend and frontend...\n');
  console.log(`  Website:  ${siteUrl}`);
  console.log(`  Admin:    ${siteUrl}/admin`);
  console.log(`  API:      http://localhost:${apiPort}`);
  console.log('  Login:    admin@littlestar.co.uk / Admin@123456\n');

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
    if (mongod) await mongod.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
