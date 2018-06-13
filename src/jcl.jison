%lex

%%

'//'                        return '//';
'/*'                        ;
(JOB|EXEC|DD)               return 'TYPE';
^[@#$A-Z][A-Z0-9]{0,7}      return 'NAME';
[0-9]+("."[0-9]+)?\b        return 'NUMBER';
[a-zA-Z]+                   return 'IDENT';
[\'\"].*?[\'\"]             return 'STRING';
IEFBR14                     return 'VALUE';
'='                         return '=';
','                         return ',';
'('                         return '(';
')'                         return ')';
[ \n\t]                     ;
<<EOF>>                     return 'EOF'
.                           return 'INVALID';

/lex
%%

E
    : '//' NAME TYPE ARG ',' KWARGS E
    | '//' NAME TYPE KWARGS E
    | EOF
    ;


KWARGS
    : NAME '=' ARG ',' KWARGS
    | NAME '=' ARG
    | IDENT '=' ARG
    ;

ARG
    : '(' ARG ')'
    | ARG ',' ARG
    | VALUE
    | STRING
    | NUMBER
    ;
