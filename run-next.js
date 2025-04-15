const { spawn } = require('child_process');
const path = require('path');

// Start the Express server for the API
const apiServer = spawn('node', ['-r', 'tsx/cjs', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start the Next.js development server
const nextServer = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit'
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