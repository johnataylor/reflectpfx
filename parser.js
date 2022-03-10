// This top down parser is almost verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108

var currentToken;

function args(get) {
    var left = { type: 'args', expression: expr(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA':
                left = { type: 'args', left: left, right: expr(true) };
                break;
            default:
                return left;
        }
    }
}

function expr(get) {
    var left = { type: 'expression', term: term(get) };
    for (;;) {
        switch (currentToken.type) {
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
        switch (currentToken.type) {
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
    switch (currentToken.type) {
        case 'NUMBER': {
            var v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'number', value: v };
        }
        case 'NAME': {
            var name = currentToken.value;
            getToken();
            // function
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return { type: 'primary', match: 'function', name: name };
                }
                else {
                    var arguments = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { type: 'primary', match: 'function', name: name, args: arguments };
                }
            }
            // variable
            else {
                return { type: 'primary', match: 'variable', name: name };
            }
        }
        case 'MINUS': {
            var p = prim(true);
            return { type: 'primary', match: 'unary-minus', primary: p };
        }
        case 'LP':
            var e = expr(true);
            if (currentToken.type !== 'RP') {
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
    if (currentToken && currentToken.type === 'END') {
        return;
    }
    // skip whitespace
    var token = tokens.shift();
    if (token.type === 'WS') {
        token = tokens.shift();
    }
    currentToken = token;
}

function eval(t) {
    tokens = t;
    for (;;) {
        getToken();
        if (currentToken && currentToken.type === 'END') {
            break;
        }
        var v = expr(false);
        return v;
    }
}

module.exports = {
    eval: eval
};

