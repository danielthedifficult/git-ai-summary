const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports.getGitSummary = async (RANGE = '7 days ago') => {
  const { stdout, stderr, error } = await exec(
    `git --no-pager log --pretty=format:'%as %an: %s%n%b' --since="${RANGE}"`
  );

  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  if (stderr) console.error(`stderr:\n${stderr}`);
  return stdout;
};
