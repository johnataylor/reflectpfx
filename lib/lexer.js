
// like UNIX lex this lexer evaluates an ordered set of regular expressions
// against the input, unlike UNIX lex it's not executing program fragments
// instead it is just returning an array of tokens containing the matching text

// http://dinosaur.compilertools.net/lex/index.html
// fun fact: the co-author of lex was Eric Schmidt (when he was an intern at Bell Labs before he ran Google)

// note NUMBER can be the subject of localization because of decimal separator

var tokenTypes = {
    PLUS: /\+/,
    MINUS: /\-/,
    MUL: /\*/,
    DIV: /\//,
    LP: /\(/,
    RP: /\)/,
    CLP: /\{/,
    CRP: /\}/,
    SLP: /\[/,
    SRP: /\]/,
    MOD: /\%/,
    COMMA: /\,/,
    NUMBER: /\d*\.?\d+([eE][+-]?\d+)?/,
    EQUAL: /\=/,
    NOT: /\!/,
    NOT_EQUAL: /\<\>/,
    LESS_THAN_EQUAL: /\<\=/,
    GREATER_THAN_EQUAL: /\>\=/,
    LESS_THAN: /\</,
    GREATER_THAN: /\>/,
    DOT: /\./,
    LOGICAL_AND: /\&\&/,
    LOGICAL_OR: /\|\|/,
    CONCAT: /\&/,
    POWER: /\^/,

    IN: /[iI][nN]/,
    EXACTIN: /[eE][xX][aA][cC][tT][iI][nN]/,
    AND: /[aA][nN][dD]/,
    OR: /[oO][rR]/,
    NOT: /[nN][oO][tT]/,
    LOGICAL_LITERAL: /[tT][rR][uU][eE]|[fF][aA][lL][sS][eE]/,
    
    WS: /\s+/,
    TEXT_LITERAL: /"{1}([^"]|"{2})*"{1}/,
    NAME: /[a-zA-Z][a-zA-Z0-9]*/
};

function nextToken(s) {
    var match = { type: 'END', index: s.length }
    for (var tokenType in tokenTypes) {
        var result = tokenTypes[tokenType].exec(s);
        if (result !== null) {
            if (result.index <= match.index) {
                match = { type: tokenType, value: result[0], index: result.index };
            }
            if (result.index === 0) {
                break;
            }
        }
    }
    return match;
}

function tokenize(s) {
    var indexStart = 0;
    var tokens = [];
    for (;;) {
        var token = nextToken(s.substring(indexStart));
        token.index += indexStart;
        tokens.push(token);
        if (token.type === 'END') {
            break;
        }
        indexStart += token.value.length;
    }
    return tokens;
}

function log(tokens) {
    tokens.forEach(function(token) {
        console.log(`${token.type} ${token.value} ${token.index}`);
    });
}

module.exports = {
    tokenize: tokenize,
    log: log
};
