#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getGptSummary } = require('./index');

try {
  const file = path.resolve(process.cwd(), '.env');
  //file exists
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf8');
    const envVars = data.split('\n');
    envVars.forEach(envVar => {
      const ENV_FROM_FILE = {};
      if (envVar.includes('=')) {
        const [key, value] = envVar.split('=');
        ENV_FROM_FILE[key] = value;
      }
      process.env = { ENV_FROM_FILE, ...process.env };
    });
  } else
    console.log(
      'Did not find .env file at',
      file,
      '\n if this is unexpected, make sure you are running this script from the same directory as your .env file.'
    );
} catch (err) {
  console.error('Error reading vars from .env:', err);
}

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    args[key.slice(2)] = value;
  }
});

// Merge env vars with defaults
const mergedArgs = { ...process.env, ...args };

getGptSummary(mergedArgs);
