import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Start the Express server for the API
const apiServer = spawn('node', ['-r', 'tsx/register', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
  cwd: process.cwd()
});

console.log('Starting API server...');

// Start the Next.js development server
console.log('Starting Next.js server...');
const nextServer = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Handle process exit
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  apiServer.kill('SIGINT');
  nextServer.kill('SIGINT');
  process.exit();
});

apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  nextServer.kill();
  process.exit(code);
});

nextServer.on('close', (code) => {
  console.log(`Next.js server exited with code ${code}`);
  apiServer.kill();
  process.exit(code);
});