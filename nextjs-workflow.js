import { join } from 'path';
import { spawn } from 'child_process';

// Start Next.js development server
const nextJsProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_CONFIG_PATH: './next.config.mjs' }
});

// Handle process exit
nextJsProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down Next.js...');
  nextJsProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down Next.js...');
  nextJsProcess.kill('SIGTERM');
});