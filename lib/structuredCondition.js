
const utils = require('./utils.js');

function traverseNonTerminal(node) {
    var result = {};
    if (node.left) {
        result.left = traverse(node.left);
        result.operator = node.operator;
    }
    result.right = traverse(node.right);
    return result;
}

function traverse(node) {
    switch (node.type) {
        case 'logicalOr':
        case 'logicalAnd': {
            return traverseNonTerminal(node);
        }
        case 'primary': {
            if (node.match === 'parenthesis' && (node.child.type === 'logicalOr' || node.child.type === 'logicalAnd')) {
                return traverse(node.child);
            }
            else {
                return { expression: utils.toString(node) };
            }
        }
        default: {
            return { expression: utils.toString(node) };
        }
    }
}

function structuredCondition(tree) {
    return traverse(tree);
}

module.exports = {
    structuredCondition: structuredCondition
};
