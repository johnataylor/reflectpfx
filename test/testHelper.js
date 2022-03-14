
const assert = require('assert');
const lexer = require('../lib/lexer.js');
const parser = require('../lib/parser.js');
const utils = require('../lib/utils.js');

function roundtrip(original) {

    // first trip through lexer and parser and pretty print
    var t1 = lexer.tokenize(original);
    var v1 = parser.eval(t1);
    var b1 = utils.print(v1);
    
    // second trip through lexer and parser and pretty print
    var t2 = lexer.tokenize(b1);
    var v2 = parser.eval(t2);
    var b2 = utils.print(v2);

    // compare the results
    assert.equal(b1, b2);
}

module.exports = { roundtrip: roundtrip }
