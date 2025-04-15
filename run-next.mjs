#!/usr/bin/env node
import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Starting Next.js application...');
console.log('Working directory:', process.cwd());

// Run next dev command
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NEXT_CONFIG_PATH: './next.config.mjs' }
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down Next.js...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down Next.js...');
  nextProcess.kill('SIGTERM');
});