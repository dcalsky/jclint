const assert = require("assert");
const parser = require("../dist/jcl.js").parser;
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const caseFolder = path.join(__dirname, "cases");
const filenames = fs.readdirSync(caseFolder);

function exec(input) {
  parser.parse(input);
  return true;
}

describe("Cases", function() {
  filenames.forEach(name => {
    it("should pass cases without error", function(done) {
      fs.readFile(path.resolve(caseFolder, name), (err, data) => {
        exec(data.toString());
        done()
      });
    });
  });
});
