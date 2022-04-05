var buf;

function append(ch) {
    buf += ch;
}

function traverseNonTerminal(node) {
    if (node.left) {
        traverse(node.left);
        append(node.operator);
    }
    traverse(node.right);
}

function traversePrimary(node) {
    switch (node.match) {
        case 'number': {
            append(node.value);
            break;
        }
        case 'text_literal': {
            append(node.value);
            break;
        }
        case 'segment_text_literal': {
            append(node.value);
            break;
        }
        case 'string_interpolation': {
            append('$"');
            if (node.child) {
                traverse(node.child);
            }
            append('"');
            break;
        }
        case 'logical_literal': {
            append(node.value);
            break;
        }
        case 'parenthesis': {
            append('(');
            traverse(node.child);
            append(')');
            break;
        }
        case 'unaryMinus': {
            append('-');
            traverse(node.child);
            break;
        }
        case 'bang': {
            append('!');
            traverse(node.child);
            break;
        }
        case 'function': {
            append(node.name);
            append('(');
            if (node.args !== undefined) {
                traverse(node.args);
            }
            append(')');
            break;
        }
        case 'variable': {
            append(node.name);
            break;
        }
        case 'inlineTable': {
            append('[');
            if (node.args !== undefined) {
                traverse(node.args);
            }
            append(']');
            break;
        }
        case 'inlineRecord': {
            append('{');
            if (node.records !== undefined) {
                traverse(node.records);
            }
            append('}');
            break;
        }
        case 'and': {
            append('And');
            append('(');
            if (node.args !== undefined) {
                traverse(node.args);
            }
            append(')');
            break;
        }
        case 'or': {
            append('Or');
            append('(');
            if (node.args !== undefined) {
                traverse(node.args);
            }
            append(')');
            break;
        }
        case 'not': {
            append('Not');
            // if parenthesis were omitted then we need to add a space
            if (node.child.match !== 'parenthesis') {
                append(' ');
            }
            traverse(node.child);
            break;
        }
        case 'percent': {
            traverse(node.child);
            append('%');
            break;
        }
        case 'as': {
            traverse(node.child);
            append(' as ');
            append(node.name);
            break;
        }
    }
}

function traverseArgs(node) {
    if (node.left) {
        traverse(node.left);
        append(',');
    }
    traverse(node.right);
}

function traverseRecords(node) {
    if (node.left) {
        traverse(node.left);
        append(',');
    }
    append(node.name);
    append(':');
    traverse(node.right);
}

function traverseStringInterpolation(node) {
    if (node.left) {
        traverse(node.left);
    }
    if (!(node.right.type === 'primary' && node.right.match === 'segment_text_literal')) {
        append('{ ');
    }
    traverse(node.right);
    if (!(node.right.type === 'primary' && node.right.match === 'segment_text_literal')) {
        append(' }');
    }
}

function traverse(node) {
    switch (node.type) {
        case 'logicalOr':
        case 'logicalAnd':
        case 'equality':
        case 'comparison':
        case 'membership':
        case 'expression':
        case 'term': {
            traverseNonTerminal(node);
            break;
        }
        case 'primary': {
            traversePrimary(node);
            break;
        }
        case 'args': {
            traverseArgs(node);
            break;
        }
        case 'record': {
            traverseRecords(node);
            break;
        }
        case 'stringInterpolation': {
            traverseStringInterpolation(node);
            break;
        }
    }
}

function toString(tree) {
    buf = '';
    traverse(tree);
    return buf;
}

module.exports = {
    toString: toString
};
