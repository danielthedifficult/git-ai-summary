#!/usr/bin/env node
const fs = require('fs');
const { getGptSummary } = require('./utils');
const data = fs.readFileSync('.env', 'utf8');
const envVars = data.split('\n');
envVars.forEach(envVar => {
  const ENV_FROM_FILE = {};
  if (envVar.includes('=')) {
    const [key, value] = envVar.split('=');
    ENV_FROM_FILE[key] = value;
  }
  process.env = { ENV_FROM_FILE, ...process.env };
});

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
