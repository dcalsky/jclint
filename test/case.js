const fs = require('fs');
const path = require('path');
const { parse } = require('../dist/jcl.js');

const caseFolder = path.join(__dirname, 'cases');
const filenames = fs.readdirSync(caseFolder);

function exec(input) {
  parse(input);
}

describe('Cases', () => {
  filenames.forEach((name) => {
    it(`should pass the \x1b[32m${name.toUpperCase()}\x1b[0m case without error`, (done) => {
      fs.readFile(path.resolve(caseFolder, name), (err, data) => {
        exec(data.toString());
        done();
      });
    });
  });
});
