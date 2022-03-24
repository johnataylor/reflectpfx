
function traverseNonTerminal(node, condition, result) {
    if (node.left) {
        traverse(node.left, condition, result);
    }
    traverse(node.right, condition, result);
}

function traversePrimary(node, condition, result) {

    switch (node.match) {
        case 'number':
        case 'text_literal':
        case 'logical_literal':
        case 'variable': {
            break;
        }
        case 'parenthesis':
        case 'unaryMinus':
        case 'bang':
        case 'not':
        case 'percent':
        case 'as': {
            traverse(node.child, condition, result);
            break;
        }
        case 'function':
        case 'inlineTable':
        case 'and':
        case 'or': {
            if (node.args) {
                traverse(node.args, condition, result);
            }
            break;
        }
        case 'inlineRecord': {
            if (node.records) {
                traverse(node.records, condition, result);
            }
            break;
        }
    }
}

function traverse(node, condition, result) {

    if (condition(node)) {
        result.push(node);
    }

    switch (node.type) {
        case 'bexpression':
        case 'expression':
        case 'term':
        case 'args':
        case 'record': {
            traverseNonTerminal(node, condition, result);
            break;
        }
        case 'primary': {
            traversePrimary(node, condition, result);
            break;
        }
    }
}

function find(tree, condition) {
    var result = [];
    traverse(tree, condition, result);
    return result;
}

module.exports = {
    find: find
};
