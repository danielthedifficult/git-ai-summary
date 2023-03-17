# Git Commit History Summarizer & Translator

***Do you love explaining your work to non-technical people?***

***Do you enjoy translating your commit history for colleagues who speak a different language?***

**Of course not!**

_That's why we've created the Git Commit History Summarizer & Translator - the tool that does the talking for you._

![explaining](https://user-images.githubusercontent.com/1290033/224572317-e1f80443-e826-45ef-822d-57e1eec16f56.gif)

This takes a git repository's commit history and uses the OpenAI ChatGPT API to summarize and/or translate it. 

It provides a convenient way to generate summaries and translations of a project's commit history, which can be helpful for freelancers or developers who need to communicate their work to non-technical clients or colleagues who speak a different language.

Note: I use, and this tool is designed for, conventional/semantic style commit messages. If you have a different format, use the `commit_format` arg to describe it.

** THIS PACKAGE SENDS YOUR COMMIT MESSAGES (but not the code or diffs) TO ChatGPT. YOU HAVE BEEN WARNED. THE AUTHOR ASSUMES NO RESPONSIBILITY FOR THE SECURITY OR PRIVACY OF YOUR SUBMISSIONS **

## Todo

- [ ] Create GitHub action that would do this on a recurring schedule or on certain events
- [ ] Convert to TS ?
- [ ] Add other [models / parameters from openai](https://platform.openai.com/docs/models/overview)
- [ ] Better output (chalk-style coloring, etc.)
- [x] Add token usage 
- [ ] Support longer commit messages / batching / chunking
- [ ] Add more options for fun and useful prompt crafting
- [ ] Way, way better error handling, with API error code hints.
## Try it out!

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Run the following from within your repo's folder to print a summary of the last 7 days of commit history to stdout:

```bash 
OPENAI_API_KEY="your-api-key" npx git-ai-summary
```

## Installation

To use this package in a script or your app, first install it:

npm:
`npm install -d git-ai-summary`

yarn:
`yarn add git-ai-summary --save-dev`


## Usage

To use this package, you will need [an OpenAI API key](https://platform.openai.com/account/api-keys) 
Set it as an env var, pass it as an arg when calling the function, or from the CLI.

- `OPENAI_API_KEY`: Your OpenAI API key


*Then, you can use in a package.json script:*

```js
scripts: {
   "es-client-2-week-summary" : "npx git-ai-summary --range='14 days ago' --audience='clients' --language='spanish' "
}
```

*In your app:*

```js
import { getGptSummary } from "git-ai-summary"
// all args optional, app uses sensible defaults
const args = {
   app_name: "My great app", // Defaults to "name" from package.json. Provides context to the model.
   app_description: "My great app does great things", // Defaults to "description" from package.json. Provides context to the model.
   range: '14 days ago', // anything compatible with git log --since 
   audience: 'clients', // finishes the sentence: 'Summarize these commit logs into friendly software release notes that will be appropriate for...'
   language: 'spanish',
   provider: 'openai',
   key: 'YOUR-OPENAI-KEY', // if OPENAI_API_KEY not in Env
   commit_format: 'Interpret the commit messages as follows: "type/scope/purpose"', // e.g. if your commit format is "fix/login/Correctly handle invalid auth with error messages"
   additional_instructions: 'Write the summaries in Haiku', // any additional instructions you want to send to ChatGPT
   verbose: true, // logs intermediary steps to console and provides full result object in CLI output
   model_params: { // https://platform.openai.com/docs/introduction/overview
      model: 'text-davinci-003', // Set your own model!
      temperature: 2, // Get some crazy results! Seriously, 0 is the default and mostly deterministic, YMMV with anything north of 0.8
      max_tokens: 500, // Be cheap!
   }
}

const summary = await getGptSummary(args)

```

*Or from the CLI:*
```sh

// Note, any of the arguments above can be specified from the command line
// Boolean values use single dash (e.g. -verbose)
// Root object vars use double dash (e.g. --language=Swahili)
// model_params use atriple "-" prefix, e.g. "git-ai-summary ---model="model_name" ---temperature=2
npm i git-ai-summary
node git-ai-summary -verbose --range="30 days ago" --key="my-open-ai-api-key" ---max_tokens=2000
```

### Example 1: Freelancer Summarizing Work for a Non-Technical Client

Suppose you are a freelancer working on a web development project for a non-technical client.

```sh
npx git-ai-summary --audience='clients' --apiKey="your-api-key" --range="14 days ago"
```

### Example 2: Developer Summarizing Work for Non-Technical Colleagues in Another Language

Suppose you are a developer working on a project with non-technical colleagues who speak a different language.

```sh
npx git-ai-summary --apiKey="your-api-key" --range="14 days ago" --language=french --audience='non-technical colleagues'
```

## Tips

#### Limits:
**Be careful sending too much of a history to ChatGPT. Even though it should be able to handle 8,000ish words, I've been getting `400` errors from their API going above 25ish commits.**

#### Formatting:
I use conventional commits, but I asked ChatGPT for the best way to structure commit messages for later summarization:

><i>To best understand and summarize commit messages for software release notes, it's helpful if the commit messages follow a consistent structure. Here are some best practices for structuring commit messages that will make it easier for me as a marketing and communications specialist to parse and understand them:
> 
>Use a one-line summary: Start the commit message with a short, one-line summary that briefly describes the change or fix. This summary should be clear and concise, and no longer than 50 characters.
> 
>Use a descriptive title: Use a descriptive title that clearly describes the nature of the change or fix.
> 
>Provide details in the body: Use the body of the commit message to provide more details about the change or fix. This can include any relevant information such as the rationale behind the change or fix, the potential benefits or impacts of the change, and any relevant technical details that are important to understanding the change.
> 
>Use bullet points: Use bullet points to clearly outline the specific changes that were made. This makes it easier to understand the nature of the change or fix and the specific impacts it may have.
> 
>Use consistent formatting: Use consistent formatting for your commit messages. This makes it easier to parse and understand them quickly and accurately.
> 
>By following these best practices, you can help me quickly understand the nature of the changes in the commit log and create friendly software release notes that will be appropriate for the intended audience.</i></quote>

## Limitations

This package relies on the OpenAI ChatGPT API, which has some limitations.

In particular, it may not be able to generate accurate summaries or translations for all types of commit messages. 

Additionally, it may not always be able to accurately identify the primary changes made in a commit. 

Therefore, you should review the generated summaries and translations to ensure they accurately reflect the work that was done.

[build-img]:https://github.com/danielthedifficult/git-ai-summary/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/danielthedifficult/git-ai-summary/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/git-ai-summary
[downloads-url]:https://www.npmtrends.com/git-ai-summary
[npm-img]:https://img.shields.io/npm/v/git-ai-summary
[npm-url]:https://www.npmjs.com/package/git-ai-summary
[issues-img]:https://img.shields.io/github/issues/danielthedifficult/git-ai-summary
[issues-url]:https://github.com/danielthedifficult/git-ai-summary/issues
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
