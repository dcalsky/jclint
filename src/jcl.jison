%lex

%%

\/\/\*.*                            ; /* skip whole line comment */
'/*'                                ;
[\'\"\#\$\@\.A-Z0-9\*]+             return 'IDENT';
\/\/[A-Z\$\#][A-Z0-9\.\#]+\s\w+\s   return 'DEFINE';
'='                                 return '=';
','                                 return ',';
'('                                 return '(';
')'                                 return ')';
\'                                  return 'SQUOTE';
\"                                  return 'DQUOTE';
\n\/\/\s+                           return 'LINE_FEED';
\n                                  return 'NEWLINE'
\s.*                                ;
<<EOF>>                             return 'EOF';


/lex
%left ',' '='
%left NEWLINE
%%

E
    : e EOF
    ;

e
    : e NEWLINE e
    | DEFINE ARGS {$$ = {
        meta: $1,
        children: $2
    }}
    |
    ;

ARGS
    : PS_ARGS ',' LINE_FEED KW_ARGS
    | PS_ARGS ',' KW_ARGS {$$ = {
        ps_args: $1,
        kw_args: $3
    }}
    | PS_ARGS {$$ = {
        ps_args: $1
    }}
    | KW_ARGS {$$ = {
        kw_args: $1
    }}
    ;


KW_ARGS
    : KW_ARGS ',' KW
    | KW_ARGS ',' LINE_FEED KW
    | KW
    ;

KW
    : IDENT '=' ARG 
    ;



PS_ARGS
    : PS_ARGS ',' ARG
    | PS_ARGS ',' LINE_FEED ARG
    | ARG
    ;

ARG
    : '(' TUPLE ')'
    | VAL
    |
    ;

TUPLE
    : TUPLE ',' TUPLE
    | '(' TUPLE ')' 
    | VAL
    |
    ;


VAL
    : SQUOTE IDENT SQUOTE
    | DQUOTE IDENT DQUOTE 
    | IDENT
    ;

