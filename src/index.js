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
    verbose: false,
    model_params: {
      model: userArgs.model || 'text-davinci-003', // in case the user is using the cli or wants to put the model at the root of the options
    },
  };
  const args = { ...defaultArgs, ...userArgs };

  args.commit_log = await getGitSummary(args.range);
  args.prompt = generatePrompt(args);

  if (args.verbose)
    console.log(
      '===== Using prompt:\n\n"',
      args.prompt,
      '"\n\n===== and commit_log:\n\n"',
      args.commit_log,
      '"'
    );

  if (getChatGptResponse[args.model_params.model]) {
    let response = await getChatGptResponse[args.model_params.model](args);
    if (args.verbose) console.log('Response from ChatGPT:', response);
    return {
      commit_log: args.commit_log,
      ...response,
    };
  } else
    throw new Error(
      'Specified model',
      args.model_params.model,
      'not a valid option. If this is a valid openai model, please open an issue or PR to add it.'
    );
}

module.exports = {
  getGptSummary,
};
