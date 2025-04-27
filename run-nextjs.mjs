#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextBin = resolve(__dirname, 'node_modules', '.bin', 'next');

// Run the Next.js development server
const nextProcess = spawn(nextBin, ['dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3000',
    HOSTNAME: '0.0.0.0'
  }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js server:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle signals
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  nextProcess.kill('SIGTERM');
});