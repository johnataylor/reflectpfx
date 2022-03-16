
const lexer = require('./lexer.js');
const parser = require('./parser.js');
const utils = require('./utils.js');
const roundtrip = require('../test/testHelper.js').roundtrip;

//var t = lexer.tokenize('7 && 0');
//var t = lexer.tokenize('f(x, y >= 6)');
var t = lexer.tokenize('"x"in"apple"');

t.forEach(function(token) { console.log(`${token.type} ${token.value}`); });

var v = parser.eval(t);

console.log(JSON.stringify(v, null, 2));

var b = utils.print(v);

console.log(b);

roundtrip('"x" in "apple"');




