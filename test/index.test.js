const {
  getGitSummary,
  generatePrompt,
  getChatGptResponse,
} = require('../src/exports');

describe('Getting Git Summaries', () => {
  it('Should be a function', () => {
    expect(typeof getGitSummary).toBe('function');
  });
  it('Should get a 7 day summary', async () => {
    const ONE_WEEK_SUMMARY = await getGitSummary('7 days ago');
    expect(ONE_WEEK_SUMMARY.length).toBeGreaterThan(1);
  });
});

describe('Test helper functions', () => {
  it('Tests prompt generation', () => {
    const testArgs = {
      additional_instructions: 'these are additional instructions',
      commit_log: 'test commit log',
      language: 'abcdefg',
      audience: 'qrstuv',
    };
    const prompt = JSON.stringify(generatePrompt(testArgs));
    expect(prompt.indexOf(testArgs.additional_instructions)).toBeGreaterThan(
      -1
    );
    expect(prompt.indexOf(testArgs.commit_log)).toBeGreaterThan(-1);
    expect(prompt.indexOf(testArgs.language)).toBeGreaterThan(-1);
    expect(prompt.indexOf(testArgs.audience)).toBeGreaterThan(-1);
    expect(prompt.indexOf('assdfasdfasdfasf')).toBe(-1);
  });
});

describe('Successfully communicate with ChatGPT', () => {
  // TODO refactor this to be an 'each' test
  it('Test a simple request on text-davinci-003', async () => {
    const model = 'text-davinci-003';

    const { status, statusText, summary } = await getChatGptResponse[model]({
      prompt: generatePrompt({
        commit_log: 'no commits this week',
      }),
      model_params: { model },
      apiKey: process.env.OPENAI_API_KEY,
    });
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
    expect(typeof summary).toBe('string');
    console.log(summary);
  });

  it('Test a simple request on gpt-turbo', async () => {
    const model = 'gpt-3.5-turbo';
    const { status, statusText, summary } = await getChatGptResponse[model]({
      prompt: generatePrompt({
        commit_log: 'no commits this week',
      }),
      model_params: { model },
      apiKey: process.env.OPENAI_API_KEY,
    });
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
    expect(typeof summary).toBe('string');
    console.log(summary);
  }, 15000);
});
