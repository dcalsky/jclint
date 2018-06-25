%lex

%%

'/*'                                        ;
\/\/\*.*                                    ; /* skip whole line comment */
[\'\"\#\$\@\.A-Z0-9\*]+                     return 'IDENT';
\/\/[A-Z\$\#][A-Z0-9\.\#]+\s\w+\s           return 'DEFINE';
\*\s+                                       return '';
'='                                         return '=';
','                                         return ',';
'('                                         return '(';
')'                                         return ')';
\'                                          return 'SQUOTE';
\"                                          return 'DQUOTE';
\n\/\/\s+                                   return 'LINE_FEED';
\n                                          return 'NEWLINE'
\s.*                                        ;
<<EOF>>                                     return 'EOF';


/lex
%left ',' '='
%left NEWLINE
%%

E
    : e EOF {return $1}
    ;

e
    : e NEWLINE e {$$ = $1.concat($3 || [])}
    | DEFINE ARGS {$$ = [{
        meta: $1,
        children: $2,
        location: @1
    }]}
    |
    ;

ARGS
    : PS_ARGS ',' LINE_FEED KW_ARGS {$$ = {
        ps_args: $1,
        kw_args: $4
    }}
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
    : KW_ARGS ',' KW {$$ = $1.concat($3)}
    | KW_ARGS ',' LINE_FEED KW {$$ = $1.concat($4)}
    | KW {$$ = $1}
    ;

KW
    : IDENT '=' ARG {$$ = [{
        key: $1,
        val: $3,
        location: @1
    }]}
    ;



PS_ARGS
    : PS_ARGS ',' ARG {$$ = $1.concat($3)}
    | PS_ARGS ',' LINE_FEED ARG {$$ = $1.concat($4)}
    | ARG {$$ = [$1]}
    ;

ARG
    : '(' TUPLE ')' {$$ = [$2]}
    | VAL {$$ = [$1]}
    | {$$ = null}
    ;

TUPLE
    : TUPLE ',' TUPLE {$$ = $1.concat($3)}
    | '(' TUPLE ')' {$$ = [$2]}
    | VAL {$$ = [$1]}
    | {$$ = [null]}
    ;


VAL
    : SQUOTE IDENT SQUOTE {$$ = $1}
    | DQUOTE IDENT DQUOTE {$$ = $1}
    | IDENT {$$ = {
      text: $1,
      location: @1
    }}
    ;

