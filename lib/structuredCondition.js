
//TODO: parse tree needs to correctly model logical operator precedence
//TODO: precedence: not, and, or

function traverse(tree, result) {
    throw new Error('Not implemented');
}

function structuredCondition(tree) {
    var result = [];
    traverse(tree, result);
    return result;
}

module.exports = {
    structuredCondition: structuredCondition
};
