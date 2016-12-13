const Path = require('path');
const replace = require('replace');

module.exports = (results) => {
  const passed = results.numPassedTests;
  const total = results.numTotalTests;
  replace({
    regex: /\*\*Results:\*\* \d+\/\d+ \(\d+%\)/,
    replacement: `**Results:** ${passed}/${total} (${Math.round((passed / total) * 100)}%)`,
    paths: [ Path.resolve(__dirname, '../README.md') ],
    recursive: false,
    silent: true
  });
};
