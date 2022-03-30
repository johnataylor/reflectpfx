
var result;

// traverse the input tree to create a postfix representation in an array

function traverse(node) {
    if (node.expression) {
        result.push({ operand: node.expression });
    }
    else {
        if (node.left) {
            traverse(node.left);
        }
        traverse(node.right);
        if (node.operator) {
            result.push({ operator: node.operator, operands: 2 });
        }
    }
}

function postfix(tree) {
    result = [];
    traverse(tree);
    return result;
}

module.exports = {
    postfix: postfix
};
