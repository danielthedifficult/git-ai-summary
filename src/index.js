async function getGptSummary(userArgs) {
  const {
    generatePrompt,
    getGitSummary,
    getChatGptResponse,
  } = require('./exports');

  const defaultArgs = {
    range: process.env.range || '7 days ago',
    audience: process.env.audience || 'clients',
    apiKey: process.env.OPENAI_API_KEY,
    language: process.env.language || 'English',
    quiet: false,
    model_params: {
      model: userArgs.model || 'text-davinci-003', // in case the user is using the cli or wants to put the model at the root of the options
    },
  };
  const args = { ...defaultArgs, ...userArgs };
  console.log(18, args);
  args.commit_log = await getGitSummary(args.range);
  args.prompt = generatePrompt(args);

  if (!args.quiet)
    console.log(
      '===== Using prompt:\n\n"',
      args.prompt,
      '"\n\n===== and commit_log:\n\n"',
      args.commit_log,
      '"'
    );

  if (getChatGptResponse[args.model_params.model])
    return await getChatGptResponse[args.model_params.model](args);
  else
    throw new Error(
      'Specified model',
      args.model_params.model,
      'not a valid option. If this is a valid openai model, please open an issue or PR to add it.'
    );
}

module.exports = {
  getGptSummary,
};
