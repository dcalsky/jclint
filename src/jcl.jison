%lex

%%

\/\/\*.*                            ; /* skip whole line comment */
'/*'                                ;
[\'\"\#\$\@\.A-Z0-9\*]+             return 'IDENT';
\/\/[A-Z\$\#][A-Z0-9\.\#]+\s\w+\s?  return 'DEFINE';
[0-9]+("."[0-9]+)?\b                return 'NUMBER';
'='                                 return '=';
','                                 return ',';
'('                                 return '(';
')'                                 return ')';
\'                                  return 'SQUOTE';
\"                                  return 'DQUOTE';
\n                                  return 'NEWLINE';
\/\/\s+                             return 'SPACES';
\s.*                                return 'COMMENT';
<<EOF>>                             return 'EOF';


/lex
%left ',' '='
%left NEWLINE
%nonassoc COMMENT, LINE_FEED

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
    : ARG ',' KWARGS
    | KWARGS
    | ARG
    ;


KWARGS
    : KWARGS ',' KWARGS
    | COMMENT KWARGS 
    | LINE_FEED KWARGS 
    | IDENT '=' ARG 
    ;

LINE_FEED
    : NEWLINE SPACES
    ;

ARG
    : ARG ',' ARG
    | COMMENT ARG
    | LINE_FEED ARG
    | LINE_FEED KWARGS
    | '(' ARG ')'
    | SQUOTE IDENT SQUOTE 
    | DQUOTE IDENT DQUOTE 
    | IDENT
    |
    ;
