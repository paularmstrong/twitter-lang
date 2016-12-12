const fs = require('fs');
const Path = require('path');
const replace = require('replace');

module.exports = (results) => {
  replace({
    regex: /Results: \d+\/\d+ \(\d+\%\)/,
    replacement: `Results: ${results.numPassedTests}/${results.numTotalTests} (${Math.round((results.numPassedTests/results.numTotalTests) * 100)}%)`,
    paths: [ Path.resolve(__dirname, '../README.md') ],
    recursive: false,
    silent: false
  });
};
