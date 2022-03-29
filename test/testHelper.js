
const assert = require('assert');
const lexer = require('../lib/lexer.js');
const parser = require('../lib/parser.js');
const utils = require('../lib/utils.js');

function roundtrip(original) {

    // first trip through lexer and parser and pretty print
    var t1 = lexer.tokenize(original);
    var c1 = t1.filter(token => token.type !== 'WS' && token.type !== 'COMMENT').length;
    var v1 = parser.eval(t1);

    // eval should return undefined for single END token
    if (v1 === undefined) {
        assert.equal(t1.length, 1);
        assert.equal(t1[0].type, 'END');
        return;
    }

    var b1 = utils.toString(v1);

    // second trip through lexer and parser and pretty print
    var t2 = lexer.tokenize(b1);
    var c2 = t2.filter(token => token.type !== 'WS' && token.type !== 'COMMENT').length;
    var v2 = parser.eval(t2);
    var b2 = utils.toString(v2);

    // compare the results
    assert.equal(c1, c2);
    assert.equal(b1, b2);
}

module.exports = { roundtrip: roundtrip }
