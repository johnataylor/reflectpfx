var buf;

function append(ch) {
    buf += ch;
}

function traverse(node) {
    switch (node.type) {
        case 'expr':
            if (node.term !== undefined) {
                traverse(node.term);
            }
            else {
                traverse(node.left);
                append(node.operator);
                traverse(node.right);
            }
            break;
        case 'term':
            if (node.primary !== undefined) {
                traverse(node.primary);
            }
            else {
                traverse(node.left);
                append(node.operator);
                traverse(node.right);
            }
            break;
        case 'primary':
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
            break;
    }
}

function print(tree) {
    buf = '';
    traverse(tree);
    return buf;
}

module.exports = { print: print };