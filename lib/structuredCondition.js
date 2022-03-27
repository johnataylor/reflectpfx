
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
        default: {
            return { expression: utils.print(node) };
        }
    }
}

function structuredCondition(tree) {
    return traverse(tree);
}

module.exports = {
    structuredCondition: structuredCondition
};
