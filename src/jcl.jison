%lex

%%

'//'                        return '//';
'/*'                        ;
(JOB|EXEC|DD)               return 'TYPE';
[A-Z0-9\.]+                 return 'IDENT';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[\'\"].*?[\'\"]             return 'STRING';
'='                         return '=';
','                         return ',';
'('                         return '(';
')'                         return ')';
\n                          return 'NEWLINE';
^\#.*                       ; /* skip comment */
[\s]+                       ; /* skip whitespace */
<<EOF>>                     return 'EOF'
.                           return 'INVALID';

/lex
%left ',' '='
%%

E
    : e EOF
    ;

e
    : '//' IDENT TYPE ARGS
    | e NEWLINE e
    |
    ;

ARGS
    : ARG ',' KWARGS
    | KWARGS
    | ARG
    ;

KWARGS
    : KWARGS ',' NEWLINE LINE_FEED
    | KWARGS ',' KWARGS
    | IDENT '=' ARG
    ;

LINE_FEED
    : '//' KWARGS
    ;

ARG
    : '(' ARG ')'
    | ARG ',' ARG
    | IDENT
    | STRING
    | NUMBER
    |
    ;
