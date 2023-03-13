require('./loadEnv');
const { getGptSummary } = require('./index');

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    args[key.slice(2)] = value;
  } else if (key.startsWith('---')) {
    args.model_params[key.slice(3)] = value; // allow specifying model parameters in CLi by using 3 dashes instead of 2
  }
});

// Merge env vars with defaults
process.env = { ...process.env, ...args };

const result = async () => await getGptSummary(args).then(console.log);
return result();
