
// this is a work in progress - perhaps the wrong approcah entirely
// anyhow its buggy - a postfiox operator has to know the number of
// operands its pulling - duh

function consolidate(b) {
    var operator = undefined;
    var last = 0;
    for (var i=0; i<b.length; i++) {
        if (b[i] === '&&' || b[i] === '||') {
            if (operator === undefined || operator !== b[i]) {
                last = i;
                operator = b[i];
            }
            else if (operator === b[i]) {
                b[last] = null;
                last = i;
            }
        }
    }
    return b.filter(value => value !== null);
}

module.exports = {
    consolidate: consolidate
}
