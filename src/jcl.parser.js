import { parser } from '../dist/jcl';

const JCL_TYPE = ['JOB', 'EXEC', 'DD'];
const KWS = {
  JOB: [
    'ADDRSPC',
    'BYTES',
    'CLASS',
    'MSGCLASS',
    'MSGLEVEL',
    'NOTIFY',
    'PRTY',
    'REGION',
    'TIME',
    'TYPRUN',
  ],
  EXEC: ['PGM', 'PROC', 'ACCT', 'ADDRSPC', 'REGION', 'TIME', 'COND', 'PARM'],
  DD: [
    'UNIT',
    'VOLUME',
    'SPACE',
    'DISP',
    'DCB',
    'SYSOUT',
    'SYSIN',
    'DSNAME',
    'JOBCAT',
    'JOBLIB',
    'STEPCAT',
    'STEPLIB',
    'DSN',
    'DSNAME',
  ],
};

class ParseError extends Error {
  constructor(type, msg, hash) {
    super('Parsing error');
    let body;
    switch (type) {
      case 'grammar': {
        const message = hash.expected
          ? `Expecting ${hash.expected.join(', ')} after this identifier`
          : msg.split('\n')[0];
        const lastColumn = body.location.last_column;
        body = {
          location: hash.loc || {
            first_line: hash.line + 1,
            last_line: hash.line + 1,
            first_column: 0,
            last_column: 100,
          },
          expected: hash.expected,
          message,
        };
        body.location.last_column = lastColumn === 0 ? 100 : lastColumn;
        break;
      }
      case 'define': {
        body = {
          location: hash,
          message: msg,
        };
        break;
      }
      case 'keyword': {
        body = {
          location: hash.location,
          key: hash.key,
          expected: hash.expected,
          message: msg,
        };
        break;
      }
      default:
        return;
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
    this.errors = [];
    this.initGrammarError();
  }

  initGrammarError() {
    this.parser.yy.parseError = (msg, hash) => {
      throw new ParseError('grammar', msg, hash);
    };
  }

  parse(source) {
    this.errors = [];
    try {
      const asts = this.parser.parse(source);
      for (let i = 0; i < asts.length; i += 1) {
        const ast = asts[i];
        ast.meta = Parser.parseMeta(ast);
        this.parseArgs(ast.meta, ast.children);
      }
    } catch (err) {
      this.errors.push(err.body);
    }
  }

  parseArgs(meta, children) {
    if (children.ps_args) this.parsePositionArgs(meta, children.ps_args);
    if (children.kw_args) this.parseKeywordArgs(meta, children.kw_args);
  }

  static parsePositionArgs(meta, psArgs) {
    psArgs.forEach(() => {});
  }

  static parseKeywordArgs(meta, kwArgs) {
    const exceptedKeywords = KWS[meta.type];
    kwArgs.forEach((item) => {
      if (!exceptedKeywords.includes(item.key)) {
        throw new ParseError(
          'keyword',
          `${item.key} is unexcepted as a keyword in ${meta.type} operator`,
          {
            location: item.location,
            key: item.key,
            expected: exceptedKeywords,
          },
        );
      }
    });
  }

  static parseMeta(ast) {
    const meta = Parser.getMeta(ast.meta);
    if (!meta.name.split('.').every(name => name.length <= 8)) {
      throw new ParseError(
        'define',
        'Name length cannot be longer than 8 characters',
        ast.location,
      );
    } else if (!JCL_TYPE.includes(meta.type)) {
      throw new ParseError('define', 'Unrecognized operator type', ast.location);
    }
    return meta;
  }

  static getMeta(rawMeta) {
    const pureMeta = rawMeta.slice(2);
    const items = pureMeta.split(' ');
    return {
      name: items[0],
      type: items[1],
    };
  }
}
