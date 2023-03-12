const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Configuration, OpenAIApi } = require('openai');
// const fs = require("fs/promises")

const data = fs.readFileSync('.env', 'utf8');
const envVars = data.split('\n');
envVars.forEach(envVar => {
  if (envVar.includes('=')) {
    const [key, value] = envVar.split('=');
    process.env[key] = value;
  }
});

// Parse command line arguments
const args = {};
process.argv.slice(2).forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    args[key.slice(2)] = value;
  }
});

// Define default values
const defaultArgs = {
  range: process.env.range || '7 days ago',
  audience: process.env.audience || 'clients',
  key: process.env.OPENAI_API_KEY,
  language: process.env.language || 'English',
  quiet: false,
};

// Merge command line arguments with defaults
const mergedArgs = { ...defaultArgs, ...args };

getGptSummary(mergedArgs);

async function getGptSummary(args) {
  const prompt = generatePrompt(args);
  const commit_log = await getGitSummary(args.range);
  if (!args.quiet)
    console.log(
      '===== Using prompt:\n\n"',
      prompt,
      '"\n\n===== and commit_log:\n\n"',
      commit_log,
      '"'
    );
  const {
    summary,
    usage: { prompt_tokens, completion_tokens },
  } = await getChatGptResponse(`${prompt} ${commit_log}`, args.key);
  if (!args.quiet)
    console.log(
      '===== Summary complete:\n',
      summary,
      `\n\n===== Used ${prompt_tokens} prompt tokens and ${completion_tokens} completion tokens`
    );
  return summary;
}

async function getGitSummary(RANGE = '7 days ago') {
  const { stdout, stderr, error } = await exec(
    `git --no-pager log --pretty=format:'%as %an: %s%n%b' --since="${RANGE}"`
  );

  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  if (stderr) console.error(`stderr:\n${stderr}`);
  else console.log(`Git log:\n${stdout}`);
  return stdout;
}

async function getChatGptResponse(prompt, apiKey) {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const request = await openai.createCompletion({
    prompt,
    ...openAiConfig(args.model_params),
  });
  const {
    status,
    statusText,
    data: { choices, usage },
  } = request;
  const summary = choices[0].text;
  return { status, statusText, summary, usage };
}

function generatePrompt(
  language = 'English',
  audience = 'clients',
  commit_format = 'Commit messages use conventional commits, so you can interpret the commit titles as follows: "type(scope): changes"'
) {
  return `You are a technology marketing and communications specialist representing our software project.
          I am going to give you a git commit log showing recent work, and I want you to do the following:
          1. Summarize these commit logs (and only the information contained within these commit logs) into friendly software release notes that will be appropriate for ${audience}.
          2. Include as much detail as possible, including the possible advantages of these changes, without being too technical.
          3. Promote new features, and report any fixed bugs in a fun and friendly tone.
    
          ${commit_format}
          
          Separate the changes, either in list format, or using newlines.
          Exclude any commits marked as "internal", "chore" or "refactor".
          Output your response in ${language}

          Here is the commit log:`;
}
function openAiConfig(model_params) {
  return {
    model: 'text-davinci-003', // best available
    temperature: 0, // 0 = Mostly deterministic
    max_tokens: 2900, // sensible default, because the max request is 4096 tokens, and the prompts consume a fair amount
    ...model_params,
  };
}

module.exports = {
  getGptSummary,
  getGitSummary,
  getChatGptResponse,
};
