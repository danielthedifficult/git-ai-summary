const fs = require('fs');
const path = require('path');
const filename = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

const ENV_FROM_FILE = {};
try {
  const file = path.resolve(process.cwd(), filename);
  //file exists
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf8');
    const envVars = data.split('\n');
    envVars.forEach(envVar => {
      if (envVar.includes('=')) {
        const [key, value] = envVar.split('=');
        ENV_FROM_FILE[key] = value;
      }
    });
    process.env = { ...ENV_FROM_FILE, ...process.env };
  } else
    console.log(
      'Did not find .env file at',
      file,
      '\n if this is unexpected, make sure you are running this script from the same directory as your .env file.'
    );
} catch (err) {
  console.error('Error reading vars from .env:', err);
}
process.env = { ...ENV_FROM_FILE, ...process.env };
