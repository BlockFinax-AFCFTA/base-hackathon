#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Starting Next.js development server...');
  execSync('npx next dev', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });
} catch (error) {
  console.error('Error starting Next.js development server:', error);
  process.exit(1);
}