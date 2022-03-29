
var result;

function traverse(node) {
    if (node.expression) {
        result.push(node.expression);
    }
    else {
        if (node.left) {
            traverse(node.left);
        }
        traverse(node.right);
        if (node.operator) {
            result.push(node.operator);
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
