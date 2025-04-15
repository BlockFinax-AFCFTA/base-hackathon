const { spawn } = require('child_process');
const path = require('path');

// Set the current working directory
const cwd = process.cwd();

// Start the Next.js application
console.log('Starting Next.js application...');
const nextProcess = spawn('node', ['run-next.mjs'], {
  stdio: 'inherit',
  cwd
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Terminating Next.js application...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});