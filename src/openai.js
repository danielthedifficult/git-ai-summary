const { Configuration, OpenAIApi } = require('openai');

const getChatGptResponse = {
  'text-davinci-003': async ({ prompt, model_params, apiKey }) => {
    try {
      const openai = new OpenAIApi(
        new Configuration({
          apiKey,
        })
      );
      let davinciPrompt = prompt.reduce(squashPromptArray, '');

      let {
        status,
        statusText,
        data: { choices, usage },
      } = await openai.createCompletion({
        prompt: davinciPrompt,
        ...openAiConfig(model_params),
      });

      return {
        status,
        statusText,
        summary: choices[0].text,
        model_params,
        usage,
      };
    } catch (e) {
      console.error('Request failed. ', e.message);
    }
  },
  'gpt-3.5-turbo': async ({ prompt, model_params, apiKey }) => {
    const openai = new OpenAIApi(
      new Configuration({
        apiKey,
      })
    );

    let {
      status,
      statusText,
      data: { choices, usage },
    } = await openai
      .createChatCompletion({
        messages: prompt,
        ...openAiConfig(model_params),
      })
      .catch(e => {
        console.error(typeof e, Object.keys(e), e.toJSON());
      });

    const summary = choices.reduce(squashChoicesArray, '');
    return {
      status,
      statusText,
      summary,
      model_params,
      usage,
    };
  },
};

function openAiConfig(model_params) {
  return {
    model: model_params.model || 'text-davinci-003', // best available
    temperature: 0, // 0 = Mostly deterministic
    max_tokens: 2900, // sensible default, because the max request is 4096 tokens, and the prompts consume a fair amount
    ...model_params,
  };
}

module.exports = {
  getChatGptResponse,
  // performOpenAiApiCallForModel,
};

function squashPromptArray(acc, curr) {
  return (acc = acc + '\n' + curr.content);
}

function squashChoicesArray(acc, curr) {
  return (acc = acc + '\n' + curr.message.content);
}
