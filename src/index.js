const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Configuration, OpenAIApi } = require('openai');
async function getGptSummary(userArgs) {
  const defaultArgs = {
    range: process.env.range || '7 days ago',
    audience: process.env.audience || 'clients',
    key: process.env.OPENAI_API_KEY,
    language: process.env.language || 'English',
    quiet: false,
  };
  const args = { ...defaultArgs, ...userArgs };

  args.prompt = generatePrompt(args);

  const commit_log = await getGitSummary(args.range);
  if (!args.quiet)
    console.log(
      '===== Using prompt:\n\n"',
      args.prompt,
      '"\n\n===== and commit_log:\n\n"',
      commit_log,
      '"'
    );
  const { summary, usage } = await getChatGptResponse(
    { prompt: `${args.prompt} ${commit_log}`, model_params: args.model_params },
    args.key
  );
  if (!args.quiet)
    console.log(
      '===== Summary complete:\n',
      summary,
      `\n\n===== Used ${usage.prompt_tokens} prompt tokens and ${usage.completion_tokens} completion tokens`
    );
  return { summary, commit_log, usage };
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
  return stdout;
}

async function getChatGptResponse({ prompt, model_params }, apiKey) {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    prompt,
    ...openAiConfig(model_params),
  });

  const {
    status,
    statusText,
    data: { choices, usage },
  } = response;
  const summary = choices[0].text;
  return { status, statusText, summary, usage };
}

function generatePrompt({
  language = 'English',
  audience = 'clients',
  additional_instructions = '',
  commit_format = 'Commit messages use conventional commits, so you can interpret the commit titles as follows: "type(scope): changes"',
}) {
  return `You are a technology marketing and communications specialist representing our software project.
           I am going to give you a git commit log showing recent work, and I want you to do the following:
           1. Summarize these commit logs (and only the information contained within these commit logs) into friendly software release notes that will be appropriate for ${audience}.
           2. Include as much detail as possible, including the possible advantages of these changes, without being too technical.
           3. Promote new features, and report any fixed bugs in a fun and friendly tone.
     
           ${commit_format}
           
           Format your summary using bullet points format and/or newlines.

           Exclude any commits marked as "internal", "chore" or "refactor".
           Output your response in ${language}
 
           ${additional_instructions}

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
