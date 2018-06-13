%lex

%%

'//'                        return '//';
'/*'                        ;
(JOB|EXEC|DD)               return 'TYPE';
^[A-Z][A-Z0-9]{0,7}         return 'IDENT';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[\'\"].*?[\'\"]             return 'STRING';
'='                         return '=';
','                         return ',';
'('                         return '(';
')'                         return ')';
[ \n\t]                     ;
<<EOF>>                     return 'EOF'
.                           return 'INVALID';

/lex
%left ','
%%

E
    : '//' IDENT TYPE ARG KWARGS E
    | EOF
    ;


KWARGS
    : ',' IDENT '=' ARG KWARGS
    | ',' IDENT '=' ARG
    |
    ;

ARG
    : '(' ARG ')'
    | ARG ',' ARG
    | IDENT
    | STRING
    | NUMBER
    |
    ;
