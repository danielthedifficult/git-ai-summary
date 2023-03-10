const { getGitSummary, getChatGptResponse } = require('../src/index');
describe('Getting Git Summaries', () => {
  it('Should be a function', () => {
    expect(typeof getGitSummary).toBe('function');
  });
  it('Should get a 7 day summary', async () => {
    const ONE_WEEK_SUMMARY = await getGitSummary('1 day ago');
    expect(ONE_WEEK_SUMMARY.length).toBeGreaterThan(1);
  });
});

describe('Successfully communicate with ChatGPT', () => {
  it('Test a simple request', async () => {
    const { status, statusText, answer } = await getChatGptResponse(
      'What is your name?'
    );
    expect(status).toBe(200);
    expect(statusText).toBe('OK');
    expect(typeof answer).toBe('string');
  });
});
