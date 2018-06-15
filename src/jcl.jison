%lex

%%

\/\/\*.*                            ; /* skip whole line comment */
'/*'                                ;
[\'\"\#\$\@\.A-Z0-9\*]+             return 'IDENT';
\/\/[A-Z\$\#][A-Z0-9\.\#]+\s\w+\s?  return 'DEFINE';
'='                                 return '=';
','                                 return ',';
'('                                 return '(';
')'                                 return ')';
\'                                  return 'SQUOTE';
\"                                  return 'DQUOTE';
\n\/\/\s+                           return 'LINE_FEED';
\n                                  return 'NEWLINE'
\s.*                                return 'COMMENT';
<<EOF>>                             return 'EOF';


/lex
%left ',' '='
%%

E
    : e EOF
    ;

e
    : e NEWLINE e
    | e COMMENT
    | DEFINE ARGS
    |
    ;

ARGS
    : PS_ARGS ',' KW_ARGS
    | PS_ARGS
    | KW_ARGS
    ;


KW_ARGS
    : KW_ARGS ',' KW
    | KW
    ;

KW
    : COMMENT KW
    | LINE_FEED KW 
    | IDENT '=' ARG 
    ;


PS_ARGS
    : PS_ARGS ',' ARG
    | ARG
    ;

ARG
    : COMMENT ARG
    | LINE_FEED ARG
    | LINE_FEED KW
    | '(' FRIST_TUPLE ')'
    | VAL
    |
    ;

FRIST_TUPLE
    : TUPLE ',' TUPLE
    | TUPLE
    ;

TUPLE
    : TUPLE ',' TUPLE
    | TUPLE ','
    | '(' TUPLE ')' 
    | VAL
    |
    ;


VAL
    : SQUOTE IDENT SQUOTE
    | DQUOTE IDENT DQUOTE 
    | IDENT
    ;

