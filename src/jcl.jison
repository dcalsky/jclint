%{
    function checkJobName(jobName) {
        if (jobName.length > 8) {
            return false;
        }
        return true;
    }

    function checkType(type, des) {
        if (type != des) {
            return false;
        }
        return true;
    }
%}

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
    : NEWLINE E
    | '//' IDENT TYPE ARG ',' KWARGS E { 
            // check job name and output whether the job name is illegal
            if (!checkJobName($2)) {
                console.log('the job name length no more than 8')
                console.log('the location is line from ' + @2.first_line + ' to ' + @2.last_line + 
                        'and column from ' + @2.first_column + ' to ' + @2.last_column)
            }
            // check job whether is 'JOB'
            if (!checkType($3, 'JOB')) {
                console.log('the word name must be JOB' + ' now is ' + $3)
                console.log('thse location is line from ' + @3.first_line + ' to ' + @3.last_line + 
                        'and column from ' + @3.first_column + ' to ' + @3.last_column)
            }
            
        }
    | '//' IDENT TYPE KWARGS E {
            // check exec whether is 'EXEC'
            if (!checkType($3, 'EXEC')) {
                console.log('the word name must be EXEC' + ' now is ' + $3)
                console.log('thse location is line from ' + @3.first_line + ' to ' + @3.last_line + 
                        'and column from ' + @3.first_column + ' to ' + @3.last_column)
            }
        }
    | '//' IDENT TYPE ARG E
    | EOF
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