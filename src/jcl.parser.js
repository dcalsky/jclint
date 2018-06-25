import { parser } from "../dist/jcl";
const JCL_TYPE = ["JOB", "EXEC", "DD"];
const KWS = {
  JOB: [
    "ADDRSPC",
    "BYTES",
    "CLASS",
    "MSGCLASS",
    "MSGLEVEL",
    "NOTIFY",
    "PRTY",
    "REGION",
    "TIME",
    "TYPRUN"
  ],
  EXEC: ["PGM", "PROC", "ACCT", "ADDRSPC", "REGION", "TIME", "COND", "PARM"]
};

class ParseError extends Error {
  constructor(type, msg, hash) {
    super("Parsing error");
    let body;
    switch (type) {
      case "grammar":
        body = {
          location: hash.loc || {
            first_line: hash.line + 1,
            last_line: hash.line + 1,
            first_column: 0
          },
          expected: hash.expected,
          message: msg
            .split("\n")
            .slice(1, 3)
            .join("\n")
        };
        break;
      case "define":
        body = {
          location: hash,
          message: msg
        };
        break;
      case "keyword":
        body = {
          location: hash.location,
          key: hash.key,
          expected: hash.expected,
          message: msg
        };
        break;
    }
    body.type = type;
    this.body = body;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default class Parser {
  constructor() {
    this.parser = parser;
    this.error = null;
    this.initGrammarError();
  }

  initGrammarError() {
    this.parser.yy.parseError = function(msg, hash) {
      throw new ParseError("grammar", msg, hash);
    };
  }

  parse(source) {
    try {
      const asts = this.parser.parse(source);
      asts.forEach(ast => {
        ast.meta = this.parseMeta(ast);
        this.parseArgs(ast.meta, ast.children);
      });
      this.error = null;
    } catch (err) {
      this.error = err.body;
    }
  }

  parseArgs(meta, children) {
    if (children.ps_args) this.parsePositionArgs(meta, children.ps_args);
    if (children.kw_args) this.parseKeywordArgs(meta, children.kw_args);
  }

  parsePositionArgs(meta, ps_args) {
    ps_args.forEach(item => {});
  }

  parseKeywordArgs(meta, kw_args) {
    const exceptedKeywords = KWS[meta.type];
    kw_args.forEach(item => {
      if (!exceptedKeywords.includes(item.key)) {
        throw new ParseError(
          "keyword",
          `${item.key} is unexcepted as a keyword in ${meta.type} operator`,
          {
            location: item.location,
            key: item.key,
            expected: exceptedKeywords
          }
        );
      }
    });
  }

  parseMeta(ast) {
    const meta = this._getMeta(ast.meta);
    if (meta.name.length > 8) {
      throw new ParseError(
        "define",
        "Name length cannot be longer than 8 characters",
        ast.location
      );
    } else if (!JCL_TYPE.includes(meta.type)) {
      throw new ParseError(
        "define",
        "Unrecognized operator type",
        ast.location
      );
    }
    return meta;
  }

  _getMeta(rawMeta) {
    const pureMeta = rawMeta.slice(2);
    const items = pureMeta.split(" ");
    return {
      name: items[0],
      type: items[1]
    };
  }
}
