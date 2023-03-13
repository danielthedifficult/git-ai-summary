const { name, description } = require('../package.json');
function generatePrompt({
  app_name = name,
  app_description = description,
  language = 'English',
  audience = 'clients',
  additional_instructions = '',
  commit_format = 'Commit messages use conventional commits, so you can interpret the commit titles as follows: "type(scope): changes"',
  commit_log,
}) {
  return [
    {
      role: 'system',
      content:
        'You are a technology marketing and communications specialist representing our software project.',
    },
    {
      role: 'user',
      content: `I am going to give you a git commit log showing recent work on my software application called ${app_name}.
            Here is a description of the software: ${app_description}
            I want you to do the following:
            1. Summarize the following commit logs (and only the information contained within these commit logs) into friendly software release notes that will be appropriate for ${audience}.
            2. Include as much detail as possible, including the possible advantages of these changes, without being too technical.
            3. Promote new features, and report any fixed bugs in a fun and friendly tone.
            Format your summary using bullet points format and/or newlines.
 
            Exclude any commits marked as "internal", "chore" or "refactor".
            Output your response in ${language}
 
            ${commit_format}
  
            ${additional_instructions}
 
            Here is the commit log:`,
    },
    { role: 'user', content: commit_log },
  ];
}

module.exports = { generatePrompt };
