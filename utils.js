var buf;

function append(ch) {
    buf += ch;
}

function traverseBexpression(node) {
    if (node.expression !== undefined) {
        traverse(node.expression);
    }
    else {
        traverse(node.left);
        append(node.operator);
        traverse(node.right);
    }
}

function traverseExpression(node) {
    if (node.term !== undefined) {
        traverse(node.term);
    }
    else {
        traverse(node.left);
        append(node.operator);
        traverse(node.right);
    }
}

function traverseTerm(node) {
    if (node.primary !== undefined) {
        traverse(node.primary);
    }
    else {
        traverse(node.left);
        append(node.operator);
        traverse(node.right);
    }
}

function traversePrimary(node) {
    switch (node.match) {
        case 'number':
            append(node.value);
            break;
        case 'parenthesis':
            append('(');
            traverse(node.expression);
            append(')');
            break;
        case 'function':
            append(node.name);
            append('(');
            if (node.args !== undefined) {
                traverse(node.args);
            }
            append(')');
            break;
        case 'variable':
            append(node.name);
            break;
    }
}

function traverseArgs(node) {
    if (node.expression !== undefined) {
        traverse(node.expression);
    }
    else {
        traverse(node.left);
        append(',');
        traverse(node.right);
    }
}

function traverse(node) {
    switch (node.type) {
        case 'bexpression':
            traverseBexpression(node);
            break;
        case 'expression':
            traverseExpression(node);
            break;
        case 'term':
            traverseTerm(node);
            break;
        case 'primary':
            traversePrimary(node);
            break;
        case 'args':
            traverseArgs(node);
            break;
    }
}

function print(tree) {
    buf = '';
    traverse(tree);
    return buf;
}

module.exports = {
    print: print
};
