// This top down parser was originally verbatim from Bjarne Stroupstrup's example in
// "The C++ Programming Language Third Edition" section 6.1.1 page 108.
// The operator precedence here, where it corresponds, follow that described on page 120 of the same book.

let currentToken;

function root(get) {
    return logicalOr(get);
}

function logicalOr(get) {
    let left = logicalAnd(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LOGICAL_OR': {
                left = { type: 'logicalOr', operator: '||', left: left, right: logicalAnd(true) };
                break;
            }
            case 'OR': {
                left = { type: 'logicalOr', operator: ' Or ', left: left, right: logicalAnd(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function logicalAnd(get) {
    let left = equality(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LOGICAL_AND': {
                left = { type: 'logicalAnd', operator: '&&', left: left, right: equality(true) };
                break;
            }
            case 'AND': {
                left = { type: 'logicalAnd', operator: ' And ', left: left, right: equality(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function equality(get) {
    let left = comparison(get);
    for (;;) {
        switch (currentToken.type) {
            case 'EQUAL': {
                left = { type: 'equality', operator: '=', left: left, right: comparison(true) };
                break;
            }
            case 'NOT_EQUAL': {
                left = { type: 'equality', operator: '<>', left: left, right: comparison(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function comparison(get) {
    let left = membership(get);
    for (;;) {
        switch (currentToken.type) {
            case 'LESS_THAN': {
                left = { type: 'comparison', operator: '<', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN': {
                left = { type: 'comparison', operator: '>', left: left, right: membership(true) };
                break;
            }
            case 'LESS_THAN_EQUAL': {
                left = { type: 'comparison', operator: '<=', left: left, right: membership(true) };
                break;
            }
            case 'GREATER_THAN_EQUAL': {
                left = { type: 'comparison', operator: '>=', left: left, right: membership(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function membership(get) {
    let left = expr(get);
    for (;;) {
        switch (currentToken.type) {
            case 'IN': {
                left = { type: 'membership', operator: ' In ', left: left, right: expr(true) };
                break;
            }
            case 'EXACTIN': {
                left = { type: 'membership', operator: ' ExactIn ', left: left, right: expr(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function expr(get) {
    let left = term(get);
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
    let left = prim(get);
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
            case 'DOT': {
                left = { type: 'term', operator: '.', left: left, right: prim(true) };
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
            const v = currentToken.value;
            getToken();
            return postFix({ type: 'primary', match: 'number', value: v });
        }
        case 'TEXT_LITERAL': {
            const v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'text_literal', value: v };
        }
        case 'SEGMENT_TEXT_LITERAL': {
            const v = currentToken.value;
            getToken();
            return { type: 'primary', match: 'segment_text_literal', value: v };
        }
        case 'BEGIN_STRING_INTERPOLATION': {
            const child = stringInterpolation();
            getToken();
            return { type: 'primary', match: 'string_interpolation', child: child };
        }
        case 'END_STRING_INTERPOLATION': {
             getToken();
             return { type: 'primary', match: 'segment_empty_expression' };
        }
        case 'LOGICAL_LITERAL': {
            const v = currentToken.value.toLowerCase();
            getToken();
            return { type: 'primary', match: 'logical_literal', value: v };
        }
        case 'NAME': {
            const name = currentToken.value;
            getToken();
            // function
            if (currentToken.type === 'LP') {
                getToken();
                if (currentToken.type === 'RP') {
                    getToken();
                    return postFix({ type: 'primary', match: 'function', name: name });
                }
                else {
                    const arguments = args(false);
                    if (currentToken.type !== 'RP') {
                        throw new Error(') expected');
                    }
                    getToken();
                    return postFix({ type: 'primary', match: 'function', name: name, args: arguments });
                }
            }
            // variable
            else {
                return postFix({ type: 'primary', match: 'variable', name: name });
            }
        }
        case 'AND': {
            const name = currentToken.value;            
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
            const name = currentToken.value;
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
            return { type: 'primary', match: 'not', child: prim(true) };
        }
        case 'BANG': {
            return { type: 'primary', match: 'bang', child: prim(true) };
        }
        case 'MINUS': {
            return { type: 'primary', match: 'unaryMinus', child: prim(true) };
        }
        case 'LP': {
            const e = root(true);
            if (currentToken.type !== 'RP') {
                throw new Error(') expected');
            }
            getToken();
            return postFix({ type: 'primary', match: 'parenthesis', child: e });
        }
        case 'SLP': {
            getToken();
            if (currentToken.type === 'SRP') {
                getToken();
                return postFix({ type: 'primary', match: 'inlineTable' });
            }
            else {
                const arguments = args(false);
                if (currentToken.type !== 'SRP') {
                    throw new Error('] expected');
                }
                getToken();
                return postFix({ type: 'primary', match: 'inlineTable', args: arguments });
            }
        }
        case 'CLP': {
            getToken();
            if (currentToken.type === 'CRP') {
                getToken();
                return { type: 'primary', match: 'inlineRecord' };
            }
            else {
                const r = records(false);
                if (currentToken.type !== 'CRP') {
                    throw new Error('} expected');
                }
                getToken();
                return { type: 'primary', match: 'inlineRecord', records: r };
            }
        }
        case 'INVALID': {
            throw new Error(`invalid input token received '${currentToken.value}'`);
        }
        default: {
            throw new Error(`primary expected, received '${currentToken.type}'`);
        }
    }
}

function postFix(primary) {
    if (currentToken.type === 'PERCENT') {
        getToken();
        return { type: 'primary', match: 'percent', child: primary };
    }
    else if (currentToken.type === 'AS') {
        getToken();
        if (currentToken.type !== 'NAME') {
            throw new Error('name expected following as operator');
        }
        const name = currentToken.value;
        getToken();
        return { type: 'primary', match: 'as', name: name, child: primary };
    }
    return primary;
}

function args(get) {
    let left = { type: 'args', right: root(get) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                left = { type: 'args', left: left, right: root(true) };
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
    const name = currentToken.value;
    getToken();
    if (currentToken.type !== 'COLON') {
        throw new Error(': expected in record');
    }
    let left = { type: 'record', name: name, right: root(true) };
    for (;;) {
        switch (currentToken.type) {
            case 'COMMA': {
                getToken();
                if (currentToken.type !== 'NAME') {
                    throw new Error('name expected in record');
                }
                const name = currentToken.value;
                getToken();
                if (currentToken.type !== 'COLON') {
                    throw new Error(': expected in record');
                }

                left = { type: 'record', left: left, name: name, right: root(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

function stringInterpolation() {
    getToken();
    if (currentToken.type === 'END_STRING_INTERPOLATION') {
        return undefined;
    }
    let left = { type: 'stringInterpolation', right: root(false) };
    for (;;) {
        switch (currentToken.type) {
            case 'STRING_INTERPOLATION_SEPARATOR': {
                left = { type: 'stringInterpolation', left: left, right: root(true) };
                break;
            }
            default: {
                return left;
            }
        }
    }
}

// slightly odd getToken arrangement to plug into the Bjarne Stroustrup code above
// TODO: make parse tree point to the underlying token

let tokens;
let index;

function getToken() {
    if (currentToken && currentToken.type === 'END') {
        return;
    }
    // skip whitespace and comments - alternatively we could use array filter
    var token = tokens[index++];
    if (token.type === 'WS' || token.type === 'COMMENT') {
        token = tokens[index++];
    }
    currentToken = token;
}

function checkForUnconsumedTokens() {
    for (;;) {
        if (currentToken && currentToken.type === 'END') {
            break;
        }
        if (currentToken.type !== 'WS' && currentToken.type !== 'COMMENT') {
            throw new Error(`unconsumed input token ${currentToken.type} ${currentToken.value}`);
        }
        getToken();
    }
}

function eval(t) {
    tokens = t;
    index = 0;
    currentToken = undefined;
    getToken();
    if (currentToken && currentToken.type === 'END') {
        return undefined;
    }
    const v = root(false);
    checkForUnconsumedTokens();
    return v;
}

module.exports = {
    eval: eval
};

