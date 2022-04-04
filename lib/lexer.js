
const stringInterpolation = require('./stringInterpolation.js');

// like UNIX lex this lexer evaluates an ordered set of regular expressions
// against the input, unlike UNIX lex it's not executing program fragments
// instead it is just returning an array of tokens containing the matching text

// http://dinosaur.compilertools.net/lex/index.html
// fun fact: the co-author of lex was Eric Schmidt (when he was an intern at Bell Labs before he ran Google)

// note NUMBER can be the subject of localization because of decimal separator

var tokenTypes = {
    COMMENT: /((\/\*)(.|[\r\n])*?(\*\/))|(\/\/.*)/,
    WS: /\s+/,
    PLUS: /\+/,
    MINUS: /\-/,
    MUL: /\*/,
    DIV: /\//,
    LP: /\(/,
    RP: /\)/,
    CLP: /\{/,
    CRP: /\}/,
    COLON: /\:/,
    SLP: /\[/,
    SRP: /\]/,
    PERCENT: /\%/,
    COMMA: /\,/,
    NUMBER: /\d*\.?\d+([eE][+-]?\d+)?/,
    EQUAL: /\=/,
    BANG: /\!/,
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
    DISAMBIGUATION: /\@/,
    BEGIN_STRING_INTERPOLATION: /\$"/,
    TEXT_LITERAL: /"{1}([^"]|"{2})*"{1}/,
    NAME: /[a-zA-Z][a-zA-Z0-9]*/,
    INVALID: /./
};

var keywords = {
    in: "IN",
    exactin: "EXACTIN",
    and: "AND",
    or: "OR",
    not: "NOT",
    true: "LOGICAL_LITERAL",
    false: "LOGICAL_LITERAL",
    as: 'AS'
};

function nextToken(s) {
    var match = { type: 'END' }
    for (var tokenType in tokenTypes) {
        var result = tokenTypes[tokenType].exec(s);
        if (result !== null) {
            if (result.index === 0) {
                match = { type: tokenType, value: result[0] };
                break;
            }
        }
    }
    if (match.type === 'NAME') {
        var keywordType = keywords[match.value.toLowerCase()];
        if (keywordType !== undefined) {
            match.type = keywordType;
        }
    }
    return match;
}

function processStringInterpolation(s, token) {

    function literal(s) {
        if (s.length > 0) {
            tokens.push({ type: 'TEXT_LITERAL', value: s });
            tokens.push({ type: 'STRING_INTERPOLATION_SEPARATOR', value: ''});
        }
    }

    function expression(s) {
        var nestedTokens = tokenize(s);
        nestedTokens.pop();

        tokens = tokens.concat(nestedTokens);
        tokens.push({ type: 'STRING_INTERPOLATION_SEPARATOR', value: ''});
    }

    var tokens = [];
    tokens.push(token);
    var indexStart = stringInterpolation.read(s, token.index + token.value.length, literal, expression);

    if (tokens.length > 1) {
        tokens.pop();
    }

    tokens.push({ type: 'END_STRING_INTERPOLATION', value: '' });

    return { indexStart: indexStart, tokens: tokens };
}

function tokenize(s) {
    var indexStart = 0;
    var tokens = [];
    for (;;) {
        var token = nextToken(s.substring(indexStart));
        token.index = indexStart;

        if (token.type === 'BEGIN_STRING_INTERPOLATION') {
            var stringInterpolationResult = processStringInterpolation(s, token);
            indexStart = stringInterpolationResult.indexStart;
            tokens = tokens.concat(stringInterpolationResult.tokens);
        }
        else {
            tokens.push(token);
            if (token.type === 'END') {
                break;
            }
            indexStart += token.value.length;
        }
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
