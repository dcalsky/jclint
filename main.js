const parser = require("./calculator.js").parser;
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function exec(input) {
  return parser.parse(input);
}

rl.on("line", input => {
  try {
    exec(input);
  } catch (e) {
    console.error(e);
  }
});
