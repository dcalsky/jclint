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
%%

E
    : e EOF
    ;

e
    : DEFINE ARGS 
    | e NEWLINE e
    |
    ;

ARGS
    : ARGS COMMENT 
    | ARG ',' KWARGS
    | KWARGS
    | ARG
    ;

KWARGS
    : KWARGS ',' LINE_FEED
    | KWARGS ',' KWARGS
    | IDENT '=' ARG
    ;

LINE_FEED
    : NEWLINE SPACES KWARGS
    ;

ARG
    : '(' ARG ')' 
    | ARG ',' ARG 
    | SQUOTE IDENT SQUOTE 
    | DQUOTE IDENT DQUOTE 
    | IDENT 
    |
    ;
