const assert = require("assert");
const parser = require("../dist/jcl.js").parser;
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const caseFolder = path.join(__dirname, "cases");
const filenames = fs.readdirSync(caseFolder);

function exec(input) {
  return parser.parse(input);
}

describe("Cases", function() {
  filenames.forEach(name => {
    it(`should pass the \x1b[32m${name.toUpperCase()}\x1b[0m case without error`, function(done) {
      fs.readFile(path.resolve(caseFolder, name), (err, data) => {
        let output = exec(data.toString());
        console.log('exec result: ' + output);
        done();
      });
    });
  });
});
