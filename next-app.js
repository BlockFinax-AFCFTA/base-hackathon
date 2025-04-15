import { exec } from 'child_process';

console.log('Starting Next.js application...');

// Run next dev command
exec('npx next dev -p 3000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  
  console.log(`stdout: ${stdout}`);
});