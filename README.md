# Git Commit History Summarizer & Translator

***Do you love explaining your work to non-technical people?***

***Do you enjoy translating your commit history for colleagues who speak a different language?***

**Of course not!**

_That's why we've created the Git Commit History Summarizer & Translator - the tool that does the talking for you._

Get Friendly User-safe Commit toKen Explanations Done

This Node.js package is designed to take a git repository's commit history and use the OpenAI ChatGPT API to summarize and/or translate it. 

It provides a convenient way to generate summaries and translations of a project's commit history, which can be helpful for freelancers or developers who need to communicate their work to non-technical clients or colleagues who speak a different language.

** THIS PACKAGE SENDS YOUR COMMIT MESSAGES (but not the code or diffs) TO ChatGPT. YOU HAVE BEEN WARNED. THE AUTHOR ASSUMES NO RESPONSIBILITY FOR THE SECURITY OR PRIVACY OF YOUR SUBMISSIONS **

## Try it out!

Run the following from within your repo's folder to print a summary of the last 7 days of commit history to stdout:

```bash 
OPENAI_API_KEY="your-api-key" npx git-magical-summaries
```

## Installation

To use this package in a script or your app, first install it via npm:

```npm install -d git-gpt-summary`

`yarn add git-gpt-summary --save-dev`

## Usage

To use this package, you will need to set your OpenAI API key as an environment variable:
- `OPENAI_API_KEY`: Your OpenAI API key


Then, you can use in a package.json script: 

```js
scripts: {
   "es-client-2-week-summary" : "range='14 days ago' audience=clients language=spanish git-gpt-summary"
}
```

Or in your app!

```js
import { getGptSummary } from "git-gpt-summmary"

const args = {
   range: '14 days ago', // anything compatible with git log --since 
   audience: 'clients', // finishes the sentence: 'Summarize these commit logs into friendly software release notes that will be appropriate for...'
   language: 'spanish',
   key: 'YOUR-OPENAI-KEY',
   quiet: true // won't log to console
   gpt_overrides: { // https://platform.openai.com/docs/introduction/overview
      model: 'text-davinci-003', // Set your own model!
      temperature: 1, // Get some crazy results!
      max_tokens: 500, // Be cheap!
   }
}

const summary = await getGptSummary(args)

```

### Example 1: Freelancer Summarizing Work for a Non-Technical Client

Suppose you are a freelancer working on a web development project for a non-technical client. At the end of each week, you want to send the client a summary of the work you've done. You can use this package to generate a summary of the commit history for the past week:

`OPENAI_API_KEY="your-api-key" RANGE="1 week ago" npx git-magical-summaries --audience 'clients'`


This will generate a summary of the past week's work, using natural language to describe the changes you've made to the code. You can then send this summary to your client, who will be able to understand what you've been working on without needing to understand the technical details.

### Example 2: Developer Summarizing Work for Non-Technical Colleagues in Another Language

Suppose you are a developer working on a project with non-technical colleagues who speak a different language. At the end of each week, you want to send them a summary of the work you've done. You can use this package to generate a summary of the commit history for the past week, and then translate it into their language:

`OPENAI_API_KEY="your-api-key" RANGE="1 week ago" npx git-magical-summaries --language spanish --audience 'technical colleagues'`

This will generate a summary of the past week's work, and then translate it into Spanish. You can then send this summary to your colleagues, who will be able to understand what you've been working on even if they don't speak English.


## Tips

I use conventional commits, but I asked ChatGPT for the best way to structure commit messages for later summarization:

```
To best understand and summarize commit messages for software release notes, it's helpful if the commit messages follow a consistent structure. Here are some best practices for structuring commit messages that will make it easier for me as a marketing and communications specialist to parse and understand them:

Use a one-line summary: Start the commit message with a short, one-line summary that briefly describes the change or fix. This summary should be clear and concise, and no longer than 50 characters.

Use a descriptive title: Use a descriptive title that clearly describes the nature of the change or fix.

Provide details in the body: Use the body of the commit message to provide more details about the change or fix. This can include any relevant information such as the rationale behind the change or fix, the potential benefits or impacts of the change, and any relevant technical details that are important to understanding the change.

Use bullet points: Use bullet points to clearly outline the specific changes that were made. This makes it easier to understand the nature of the change or fix and the specific impacts it may have.

Use consistent formatting: Use consistent formatting for your commit messages. This makes it easier to parse and understand them quickly and accurately.

By following these best practices, you can help me quickly understand the nature of the changes in the commit log and create friendly software release notes that will be appropriate for the intended audience.
```

## Limitations

This package relies on the OpenAI ChatGPT API, which has some limitations.

In particular, it may not be able to generate accurate summaries or translations for all types of commit messages. 

Additionally, it may not always be able to accurately identify the primary changes made in a commit. 

Therefore, you should review the generated summaries and translations to ensure they accurately reflect the work that was done.