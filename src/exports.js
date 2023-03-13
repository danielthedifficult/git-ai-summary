const {
  getChatGptResponse,
  performOpenAiApiCallForModel,
} = require('./openai');
const { generatePrompt } = require('./generatePrompt');
const { getGitSummary } = require('./getGitSummary');

module.exports = {
  getChatGptResponse,
  performOpenAiApiCallForModel,
  generatePrompt,
  getGitSummary,
};
