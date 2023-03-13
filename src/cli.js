require('./loadEnv');
const { getGptSummary } = require('./index');

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('-')) args[key.slice(2)] = true;
  else if (key.startsWith('--')) {
    args[key.slice(2)] = value;
  } else if (key.startsWith('---')) {
    args.model_params[key.slice(3)] = value; // allow specifying model parameters in CLi by using 3 dashes instead of 2
  } else console.log('Warning: unsupported argument format:', arg);
});

// Merge env vars with defaults
process.env = { ...process.env, ...args };

const main = async () => {
  let result = await getGptSummary(args);
  process.stdout.write(args.v ? result : result.summary);
};

main();
