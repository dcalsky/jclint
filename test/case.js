const assert = require("assert");
const parser = require("../dist/jcl").parser;
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const caseFolder = path.join(__dirname, "cases");
const filenames = fs.readdirSync(caseFolder);

// define the key-params
const schema = Joi.object().keys({
  jobname: Joi.string().alphanum().min(1).max(8),
  time: Joi.number().integer().min(2).max(2000)
});

function exec(input) {
  return parser.parse(input);
}

function validate(input) {
  // errors array
  var results = []
  for (let i = 0; i < input.length; i++) {
    let type = input[i].meta.substring(input[i].meta.indexOf(' ') + 1, input[i].meta.length - 1)
    let name = input[i].meta.substring(2, input[i].meta.indexOf(' '));
    switch (type) {
      case 'JOB':
        // validate the job name
        const result = Joi.validate({ jobname: name }, schema);
        if (result.error != null) {
          // output error details
          error = {
            text: name,
            type: type,
            message: result.error.details[0].message,
            position: input[i].position
          }
          results.push(error)
        } else {
          if (input[i].children.kw_args != undefined) {
            let kw_args = input[i].children.kw_args;

            for (let j = 0; j < kw_args.length; j++) {
              let key = kw_args[j].key;
              let value = kw_args[j].val;
              // check the kw
              if (key.match(/(JOB|NOTIFY|CLASS|BILIBILI|)/) != 0) {
                //console.log(value)
              } else {
                console.log('unknown key' + key)
              }
            }
          }
        }
        break
      case 'EXEC':
        break
      case 'DD':
        break
      default:
        break
    }
  }
  if (results.length > 0) {
    console.log(results)
  }
}

describe("Cases", function() {
  filenames.forEach(name => {
    it(`should pass the \x1b[32m${name.toUpperCase()}\x1b[0m case without error`, function(done) {
      fs.readFile(path.resolve(caseFolder, name), (err, data) => {
        let output = exec(data.toString());
        validate(output)
        done();
      });
    });
  });
});
