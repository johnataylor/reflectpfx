var buf;

function append(ch) {
    buf += ch;
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
            append(node.value.toString());
            break;
        case 'parenthesis':
            append('(');
            traverse(node.expression);
            append(')');
            break;
    }
}

function traverse(node) {
    switch (node.type) {
        case 'expression':
            traverseExpression(node);
            break;
        case 'term':
            traverseTerm(node);
            break;
        case 'primary':
            traversePrimary(node);
            break;
    }
}

function print(tree) {
    buf = '';
    traverse(tree);
    return buf;
}

module.exports = { print: print };