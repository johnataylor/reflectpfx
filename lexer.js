
// like UNIX lex this lexer evaluates an ordered set of regular expressions
// against the input, unlike UNIX lex it's not executing program fragments
// instead it is just returning an array of tokens containing the matching text

// http://dinosaur.compilertools.net/lex/index.html
// fun fact: the co-author of lex was Eric Schmidt (when he was an intern at Bell Labs before he ran Google)

var tokenTypes = {
    WS: /\s+/,
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
    NUMBER: /\d+/,
    EQUAL: /\=/,
    NOT_EQUAL: /\<\>/,
    NOT: /\!/,
    LESS_THAN: /\</,
    LESS_THAN_EQUAL: /\<\=/,
    GREATER_THAN: /\>/,
    GREATER_THAN_EQUAL: /\>\=/,
    CONCAT: /\&/,
    DOT: /\./,
    LOGICAL_AND: /\&\&/,
    LOGICAL_OR: /\|\|/,
    AND: /[aA][nN][dD]/,
    OR: /[oO][rR]/,
    LOGICAL_LITERAL: /[tT][rR][uU][eE]|[fF][aA][lL][sS][eE]/,
    //TEXT_LITERAL: /"(?!")[^"]*"(?!")/,
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
            // alternative have all regex include ^ assertion
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
