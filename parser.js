// This top down parser is almost verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108

var currTok = '';
var numberValue = 0;

function expr(get) {
    var left = { type: 'expression', term: term(get) };
    for (;;) {
        switch (currTok) {
            case 'PLUS':
                left = { type: 'expression', operator: '+', left: left, right: term(true) };
                break;
            case 'MINUS':
                left = { type: 'expression', operator: '-', left: left, right: term(true) };
                break;
            default:
                return left;
        }
    }
}

function term(get) {
    var left = { type: 'term', primary: prim(get) };
    for (;;) {
        switch (currTok) {
            case 'MUL':
                left = { type: 'term', operator: '*', left: left, right: prim(true) };
                break;
            case 'DIV':
                var d = prim(true);
                if (d === 0) {
                    throw new Error('division by zero');
                }
                left = { type: 'term', operator: '/', left: left, right: prim(true) };
                break;
            default:
                return left;
        }
    }
}

function prim(get) {
    if (get) {
        getToken();
    }
    switch (currTok) {
        case 'NUMBER': {
            var v = numberValue;
            getToken();
            return { type: 'primary', match: 'number', value: v };
        }
        case 'NAME': {
            throw new Error('not implemented');
        }
        case 'MINUS': {
            var p = prim(true);
            return { type: 'primary', match: 'unary-minus', primary: p };
        }
        case 'LP':
            var e = expr(true);
            if (currTok !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return { type: 'primary', match: 'parenthesis', expression: e };
        default:
            throw new Error('primary expected');
    }
}

// slightly odd getToken arrangement to plug into the Bjarne Stroustrup code above

var tokens;

function getToken() {
    if (currTok === 'END') {
        return;
    }
    // skip whitespace
    var token = tokens.shift();
    if (token.type === 'WS') {
        token = tokens.shift();
    }
    // the lexer returns text spans, strings from the original 
    currTok = token.type;
    if (token.type === 'NUMBER') {
        numberValue = parseInt(token.value);
    }
}

function eval(t) {
    tokens = t;
    for (;;) {
        getToken();
        if (currTok === 'END') {
            break;
        }
        var v = expr(false);
        return v;
    }
}

module.exports = {
    eval: eval
};

