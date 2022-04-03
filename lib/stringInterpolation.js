
// The idea here is recognizing that string interpolation consists of two distinct syntaxes and they
// alternate, specifically you are either reading a string literal or reading an expression
// the inherent recursion (expressions that use string interpolation) is left to a higher level

// note that this code assumes the leading '$"' token has been consumed and we are pointing at the next character

function read(s, i, literal, expression) {

    function readLiteral() {
        var result = '';
        for (;;) {
            if (i === s.length) {
                if (result.length > 0) {
                    throw new Error(`unconsumed characters: '${result}'`);
                }
                return false;
            }
            if (s[i] === '"' && s[i+1] === '"' || s[i] === '{' && s[i+1] === '{') {
                result += s[i++];
                result += s[i++];
            }
            else {
                var ch = s[i++];
                if (ch === '{') {
                    literal(result);
                    return true;
                }
                if (ch === '"') {
                    literal(result);
                    return false;
                }
                result += ch;
            }
        }
    }

    function readExpression() {
        var result = '';
        var depth = 1;
        for (;;) {
            if (i === s.length) {
                if (result.length > 0) {
                    throw new Error(`unconsumed characters: '${result}'`);
                }
                return false;
            }
            var ch = s[i++];
            result += ch;
            if (ch === '{') {
                depth++;
            }
            if (ch == '}') {
                depth--;            
                if (depth === 0) {
                    expression(result.slice(0, result.length - 1));
                    return true;
                }
            }
        }
    }

    while (readLiteral() && readExpression()) { }
}

module.exports = {
    read: read
}
