// This top down parser is almost verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108

var currentToken;

function args(get) {
    var left = { type: 'args', expression: bexpr(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                left = { type: 'args', left: left, right: bexpr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function records(get) {
    // the structure of this doesn't seem quite right - for example 'get' arg isn't used...
    if (currentToken.type !== 'NAME') {
        throw new Error('name expected in record');
    }
    var name = currentToken.value;
    getToken();
    if (currentToken.type !== 'COLON') {
        throw new Error(': expected in record');
    }
    var left = { type: 'record', name: name, expression: bexpr(true) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                getToken();
                if (currentToken.type !== 'NAME') {
                    throw new Error('name expected in record');
                }
                var name = currentToken.value;
                getToken();
                if (currentToken.type !== 'COLON') {
                    throw new Error(': expected in record');
                }

                left = { type: 'record', left: left, name: name, right: bexpr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function bexpr(get) {
    var left = { type: 'bexpression', expression: expr(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'LESS_THAN': {
                left = { type: 'bexpression', operator: '<', left: left, right: expr(true) };
                break;
            }
            case 'GREATER_THAN': {
                left = { type: 'bexpression', operator: '>', left: left, right: expr(true) };
                break;
            }
            case 'EQUAL': {
                left = { type: 'bexpression', operator: '=', left: left, right: expr(true) };
                break;
            }
            case 'NOT_EQUAL': {
                left = { type: 'bexpression', operator: '<>', left: left, right: expr(true) };
                break;
            }
            case 'LESS_THAN_EQUAL': {
                left = { type: 'bexpression', operator: '<=', left: left, right: expr(true) };
                break;
            }
            case 'GREATER_THAN_EQUAL': {
                left = { type: 'bexpression', operator: '>=', left: left, right: expr(true) };
                break;
            }
            case 'AND': {
                left = { type: 'bexpression', operator: ' And ', left: left, right: expr(true) };
                break;
            }
            case 'OR': {
                left = { type: 'bexpression', operator: ' Or ', left: left, right: expr(true) };
                break;
            }
            case 'LOGICAL_AND': {
                left = { type: 'bexpression', operator: '&&', left: left, right: expr(true) };
                break;
            }
            case 'LOGICAL_OR': {
                left = { type: 'bexpression', operator: '||', left: left, right: expr(true) };
                break;
            }
            case 'IN': {
                left = { type: 'bexpression', operator: ' In ', left: left, right: expr(true) };
                break;
            }
            case 'EXACTIN': {
                left = { type: 'bexpression', operator: ' ExactIn ', left: left, right: expr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function expr(get) {
    var left = { type: 'expression', term: term(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'PLUS': {
                left = { type: 'expression', operator: '+', left: left, right: term(true) };
                break;
            }
            case 'MINUS': {
                left = { type: 'expression', operator: '-', left: left, right: term(true) };
                break;
            }
            case 'CONCAT': {
                left = { type: 'expression', operator: '&', left: left, right: term(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function term(get) {
    var left = { type: 'term', primary: prim(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'MUL': {
                left = { type: 'term', operator: '*', left: left, right: prim(true) };
                break;
            }
            case 'DIV': {
                left = { type: 'term', operator: '/', left: left, right: prim(true) };
                break;
            }
            default: {
                return left;
            }
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
        case 'TEXT_LITERAL': {
            var v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'text_literal', value: v };
        }
        case 'LOGICAL_LITERAL': {
            var v = currentToken.value.toLowerCase();
            getToken();
            return { type: 'primary', match: 'logical_literal', value: v };
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
        case 'AND': {
            getToken();
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return { type: 'primary', match: 'and', name: name };
                }
                else {
                    var arguments = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { type: 'primary', match: 'and', name: name, args: arguments };
                }
            }
        }
        case 'OR': {
            getToken();
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return { type: 'primary', match: 'or', name: name };
                }
                else {
                    var arguments = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return { type: 'primary', match: 'or', name: name, args: arguments };
                }
            }
        }
        case 'NOT': {
            return { type: 'primary', match: 'not', expression: bexpr(true) };
        }
        case 'BANG': {
            return { type: 'primary', match: 'bang', expression: bexpr(true) };
        }
        case 'MINUS': {
            return { type: 'primary', match: 'unaryMinus', primary: prim(true) };
        }
        case 'LP': {
            var e = bexpr(true);
            if (currentToken.type !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return { type: 'primary', match: 'parenthesis', expression: e };
        }
        case 'SLP': {
            getToken();
            if (currentToken.type === 'SRP') {
                getToken();
                return { type: 'primary', match: 'inlineTable' };
            }
            else {
                var arguments = args(false);
                if (currentToken.type !== 'SRP') {
                    throw new Error('] expected');
                }
                getToken();
                return { type: 'primary', match: 'inlineTable', args: arguments };
            }
        }
        case 'CLP': {
            getToken();
            if (currentToken.type === 'CRP') {
                getToken();
                return { type: 'primary', match: 'inlineRecord' };
            }
            else {
                var r = records(false);
                if (currentToken.type !== 'CRP') {
                    throw new Error('} expected');
                }
                getToken();
                return { type: 'primary', match: 'inlineRecord', records: r };
            }
        }
        default: {
            throw new Error(`primary expected, received ${currentToken.type}`);
        }
    }
}

// slightly odd getToken arrangement to plug into the Bjarne Stroustrup code above

// TODO: make parse tree point to the underlying token

var tokens;
var index;

function getToken() {
    if (currentToken && currentToken.type === 'END') {
        return;
    }
    // skip whitespace - alternatively we could use array filter
    var token = tokens[index++];
    if (token.type === 'WS') {
        token = tokens[index++];
    }
    currentToken = token;
}

function eval(t) {
    tokens = t;
    index = 0;
    currentToken = undefined;
    for (;;) {
        getToken();
        if (currentToken && currentToken.type === 'END') {
            break;
        }
        var v = bexpr(false);
        return v;
    }
}

module.exports = {
    eval: eval
};

